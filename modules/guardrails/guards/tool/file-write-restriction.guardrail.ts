import path from 'path';
import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';
import { GuardrailResult } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config
 * ========================================================================== */
export interface FileWriteRestrictionConfig {
  /**
   * Absolute directories where write is allowed
   * Example: ['/tmp', '/var/app/data']
   */
  allowedWriteDirs?: string[];

  /**
   * Absolute directories that are always blocked
   * Example: ['/etc', '/root', '/proc']
   */
  blockedWriteDirs?: string[];

  /**
   * Allow relative paths (resolved against cwd)
   */
  allowRelativePaths?: boolean;

  /**
   * Maximum allowed file size (bytes), if provided by toolArgs
   */
  maxFileSizeBytes?: number;

  /**
   * Block hidden files (.env, .git/config)
   */
  blockHiddenFiles?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================== */
export class FileWriteRestrictionGuardrail extends BaseGuardrail<FileWriteRestrictionConfig> {
  constructor(config?: unknown) {
    const resolved = (config ?? {}) as FileWriteRestrictionConfig;

    super('FileWriteRestriction', 'tool', {
      allowRelativePaths: false,
      blockHiddenFiles: true,
      ...resolved,
    });
  }

  execute(_: string, context: GuardrailContext): GuardrailResult {
    const { toolName, toolArgs } = context;

    // Only enforce on file write–type tools
    if (!this.isFileWriteTool(toolName, toolArgs)) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Not a file write operation',
      });
    }

    const filePath = toolArgs?.path;
    if (!filePath || typeof filePath !== 'string') {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'File write attempted without valid path',
      });
    }

    const resolvedPath = this.resolvePath(filePath);

    // Hidden files
    if (this.config.blockHiddenFiles && this.isHiddenFile(resolvedPath)) {
      return this.block(`Write to hidden file is not allowed: ${filePath}`);
    }

    // Blocked directories
    if (this.isInBlockedDir(resolvedPath)) {
      return this.block(`Write to restricted directory: ${resolvedPath}`);
    }

    // Allowed directories enforcement
    if (this.config.allowedWriteDirs?.length && !this.isInAllowedDir(resolvedPath)) {
      return this.block(`Write outside allowed directories: ${resolvedPath}`);
    }

    // File size enforcement
    if (
      this.config.maxFileSizeBytes &&
      typeof toolArgs?.size === 'number' &&
      toolArgs.size > this.config.maxFileSizeBytes
    ) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: `File size exceeds limit (${toolArgs.size} bytes)`,
      });
    }

    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: `File write allowed: ${resolvedPath}`,
      metadata: {
        resolvedPath,
      },
    });
  }

  /* =========================================================================
   * Helpers
   * ========================================================================= */

  private isFileWriteTool(toolName?: string, toolArgs?: Record<string, unknown>): boolean {
    if (!toolName) return false;
    if (/file|fs|write/i.test(toolName)) return true;
    if (toolArgs?.operation === 'write') return true;
    return false;
  }

  private resolvePath(p: string): string {
    if (path.isAbsolute(p)) return path.normalize(p);

    if (!this.config.allowRelativePaths) {
      throw new Error('Relative file paths are not allowed');
    }

    return path.resolve(process.cwd(), p);
  }

  private isHiddenFile(resolvedPath: string): boolean {
    return path.basename(resolvedPath).startsWith('.');
  }

  private isInBlockedDir(resolvedPath: string): boolean {
    return (
      this.config.blockedWriteDirs?.some((dir) => resolvedPath.startsWith(path.normalize(dir))) ??
      false
    );
  }

  private isInAllowedDir(resolvedPath: string): boolean {
    return (
      this.config.allowedWriteDirs?.some((dir) => resolvedPath.startsWith(path.normalize(dir))) ??
      false
    );
  }

  private block(message: string): GuardrailResult {
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message,
    });
  }
}
