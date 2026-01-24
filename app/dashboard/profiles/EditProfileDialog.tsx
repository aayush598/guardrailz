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

import { GuardrailPicker } from './GuardrailPicker';
import type { ProfileUI } from '@/modules/profiles/types/profile-ui';

interface EditProfileDialogProps {
  profile: ProfileUI;
  allGuardrails: string[];
  onUpdated: (profile: ProfileUI) => void;
}

export function EditProfileDialog({ profile, allGuardrails, onUpdated }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description);
  const [isSaving, setIsSaving] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    profile.inputGuardrails.forEach((g) => (map[g.name] = true));
    setSelected(map);
  }, [profile]);

  const toggle = (name: string) => {
    setSelected((p) => ({ ...p, [name]: !p[name] }));
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const inputGuardrails = Object.entries(selected)
        .filter(([, v]) => v)
        .map(([name]) => ({ name }));

      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          inputGuardrails,
          outputGuardrails: [],
          toolGuardrails: [],
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const data = await res.json();
      onUpdated(data.profile);
      toast.success('Profile updated');
      setOpen(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update the name, description, and guardrails for this profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <GuardrailPicker guardrails={allGuardrails} selected={selected} onToggle={toggle} />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
