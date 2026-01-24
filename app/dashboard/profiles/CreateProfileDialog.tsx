'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import type { ProfileUI } from '@/modules/profiles/types/profile-ui';
import type { GuardrailDescriptor } from '@/modules/guardrails/descriptors/types';

import { GuardrailPicker } from './GuardrailPicker';

interface CreateProfileDialogProps {
  children: React.ReactNode;
  onCreated: (profile: ProfileUI) => void;
}

interface GuardrailCatalogResponse {
  guardrails: {
    name: string;
  }[];
}

export function CreateProfileDialog({ children, onCreated }: CreateProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [guardrails, setGuardrails] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Fetch available guardrails
  useEffect(() => {
    if (!open) return;

    fetch('/api/guardrails/catalog')
      .then((r) => r.json())
      .then((d: GuardrailCatalogResponse) => {
        setGuardrails(d.guardrails.map((g) => g.name));
      })
      .catch(() => toast.error('Failed to load guardrails'));
  }, [open]);

  const toggle = (name: string) => {
    setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const createProfile = async () => {
    if (!name.trim()) {
      toast.error('Profile name is required');
      return;
    }

    const descriptors: GuardrailDescriptor[] = Object.entries(selected)
      .filter(([, enabled]) => enabled)
      .map(([name]) => ({ name }));

    setLoading(true);

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          inputGuardrails: descriptors,
          outputGuardrails: [],
          toolGuardrails: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onCreated(data.profile);
      toast.success('Profile created');

      setOpen(false);
      setName('');
      setDescription('');
      setSelected({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Custom Profile</DialogTitle>
            <DialogDescription>
              Create a new profile with a custom set of guardrails.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="e.g. internal-ai-policy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* GUARDRAILS */}
            <div>
              <Label>Guardrails</Label>
              <div className="mt-2 space-y-2 rounded-md border p-3">
                <GuardrailPicker guardrails={guardrails} selected={selected} onToggle={toggle} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createProfile} disabled={loading}>
              {loading ? 'Creating…' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
