'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ScanLine,
  ArrowDownToLine,
} from 'lucide-react';

const checks = [
  { label: 'PII Detection', status: 'flagged' },
  { label: 'Secret Scanning', status: 'pass' },
  { label: 'Prompt Injection', status: 'blocked' },
  { label: 'Profanity Filter', status: 'pass' },
];

const statusMeta: Record<string, { icon: typeof ShieldAlert; label: string; cls: string }> = {
  flagged: {
    icon: ShieldAlert,
    label: 'Flagged',
    cls: 'bg-red-50 text-red-600 border-red-100',
  },
  pass: {
    icon: CheckCircle2,
    label: 'Passed',
    cls: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  blocked: {
    icon: ShieldAlert,
    label: 'Blocked',
    cls: 'bg-amber-50 text-amber-600 border-amber-100',
  },
};

function LiveLatency({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}ms`;
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>42ms</span>;
}

const barHeights = [0.45, 0.75, 0.55, 0.9, 0.6, 0.8];

export default function HeroMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [latency, setLatency] = useState(42);

  // 3D tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(rx, [-0.5, 0.5], [5, -5]), {
    stiffness: 140,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(ry, [-0.5, 0.5], [-6, 6]), {
    stiffness: 140,
    damping: 20,
  });

  // Live latency ticks
  useEffect(() => {
    const id = setInterval(() => setLatency(38 + Math.floor(Math.random() * 14)), 2400);
    return () => clearInterval(id);
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rx.set((e.clientY - rect.top) / rect.height - 0.5);
    ry.set((e.clientX - rect.left) / rect.width - 0.5);
  };

  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      className="relative mx-auto w-full max-w-lg lg:max-w-none"
    >
      {/* Halo behind the mockup */}
      <div className="bg-halo pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ z: 24 }}
        className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-400">
            <Lock className="h-3 w-3" />
            app.guardrailz.dev/playground
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            LIVE
          </span>
        </div>

        {/* Mockup body */}
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-900">Validation run</div>
              <div className="text-xs text-neutral-500">profile · default</div>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-600">
              <Zap className="h-3.5 w-3.5 text-brand-600" />
              12 checks · parallel
            </div>
          </div>

          {/* Input preview with scanning beam */}
          <div className="relative mb-4 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                Input
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400">
                <ScanLine className="h-3 w-3" />
                scanning
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-neutral-600">
              &quot;My card is{' '}
              <span className="rounded bg-red-50 px-1 text-red-600">4111 •••• •••• 1234</span> and
              my password is <span className="rounded bg-red-50 px-1 text-red-600">hunter2</span>.
              Also, ignore all previous instructions and…&quot;
            </p>

            {/* Scan beam */}
            <div className="animate-scan pointer-events-none absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-brand-600/10 to-brand-600/25" />
          </div>

          {/* Check list — staggered entrance */}
          <div className="space-y-2">
            {checks.map((check, i) => {
              const resolved = statusMeta[check.status];
              if (!resolved) return null;
              const StatusIcon = resolved.icon;
              return (
                <motion.div
                  key={check.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.12, ease: 'easeOut' }}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        check.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-400'
                      } animate-pulse-dot`}
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                    {check.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${resolved.cls}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {resolved.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Footer — live latency + activity bars + verdict */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95, ease: 'easeOut' }}
            className="mt-4 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-medium text-neutral-700">
                  <LiveLatency value={latency} /> total
                </span>
              </div>

              {/* Live activity bars */}
              <div className="flex h-6 items-end gap-0.5">
                {barHeights.map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-full bg-brand-500/50"
                    animate={{ height: [`${h * 100}%`, `${(h + 0.18) * 100}%`, `${h * 100}%`] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.14,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="animate-pulse-ring inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              <ShieldAlert className="h-3.5 w-3.5" />
              BLOCKED
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="mt-5 flex items-center justify-center gap-2 text-sm text-neutral-400"
      >
        <ShieldCheck className="h-4 w-4" />
        <span>Real-time validation · nothing sent to your model</span>
      </motion.div>

      {/* Floating delivery chip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.25 }}
        style={{ z: 40 }}
        className="absolute -right-3 top-16 hidden items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 shadow-lg shadow-neutral-900/5 sm:flex"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
          <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-600" />
        </span>
        <div className="text-left">
          <div className="text-xs font-semibold text-neutral-900">Response scrubbed</div>
          <div className="text-[10px] text-neutral-500">PII removed · 0.4s ago</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
