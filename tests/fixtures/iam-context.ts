export function createIAMToolContext(overrides: Partial<any> = {}) {
  return {
    toolName: 'aws.s3.putObject',
    requiredPermissions: ['s3:PutObject'],
    grantedPermissions: ['s3:PutObject'],
    ...overrides,
  };
}
