'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Zap, FileCode, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import type { GuardrailDescriptor } from '@/modules/guardrails/descriptors/types';
import type { LucideIcon } from 'lucide-react';

import { CreateProfileDialog } from './CreateProfileDialog';
import { EditProfileDialog } from './EditProfileDialog';
import { DeleteProfileButton } from './DeleteProfileButton';

interface Profile {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  inputGuardrails: GuardrailDescriptor[];
  outputGuardrails: GuardrailDescriptor[];
  toolGuardrails: GuardrailDescriptor[];
}

const PROFILE_ICON_MAP: Record<string, LucideIcon> = {
  default: ShieldCheck,
  enterprise: Lock,
  healthcare: ShieldCheck,
  financial: Lock,
  minimal: FileCode,
};

export default function ProfilesClient({ profiles: initialProfiles }: { profiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [allGuardrails, setAllGuardrails] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');

  const filteredProfiles = profiles.filter((p) => {
    if (filter === 'custom') return !p.isBuiltIn;
    if (filter === 'builtin') return p.isBuiltIn;
    return true;
  });

  useEffect(() => {
    fetch('/api/guardrails/catalog')
      .then((r) => r.json())
      .then((d: { guardrails: { name: string }[] }) =>
        setAllGuardrails(d.guardrails.map((g) => g.name)),
      );
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Guardrail Profiles</h1>
          <p className="mt-1 text-slate-600">Pre-built and custom security configurations</p>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={filter} onValueChange={setFilter} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="builtin">Built-in</TabsTrigger>
            </TabsList>
          </Tabs>

          <CreateProfileDialog
            onCreated={(profile) => {
              setProfiles((prev) => [profile, ...prev]);
            }}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          </CreateProfileDialog>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProfiles.map((profile) => {
            const Icon = PROFILE_ICON_MAP[profile.name.toLowerCase()] || ShieldCheck;

            return (
              <motion.div
                layout
                key={profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-slate-200 transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-100 p-3">
                        <Icon className="h-6 w-6 text-slate-800" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription>{profile.description}</CardDescription>
                      </div>
                    </div>

                    {profile.isBuiltIn ? (
                      <Badge variant="secondary" className="whitespace-nowrap">
                        Built-in
                      </Badge>
                    ) : (
                      <Badge className="whitespace-nowrap">Custom</Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <Stat
                        icon={<Lock className="h-4 w-4" />}
                        label="Input"
                        value={profile.inputGuardrails.length}
                      />
                      <Stat
                        icon={<ShieldCheck className="h-4 w-4" />}
                        label="Output"
                        value={profile.outputGuardrails.length}
                      />
                      <Stat
                        icon={<Zap className="h-4 w-4" />}
                        label="Tool"
                        value={profile.toolGuardrails.length}
                      />
                    </div>

                    {!profile.isBuiltIn && (
                      <div className="flex gap-2">
                        <EditProfileDialog
                          profile={profile}
                          allGuardrails={allGuardrails}
                          onUpdated={(updated) =>
                            setProfiles((p) => p.map((x) => (x.id === updated.id ? updated : x)))
                          }
                        />

                        <DeleteProfileButton
                          profileId={profile.id}
                          onDeleted={() => setProfiles((p) => p.filter((x) => x.id !== profile.id))}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 text-center">
      <div className="mb-1 flex justify-center text-slate-600">{icon}</div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
