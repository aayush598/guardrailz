'use client';

import { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Power,
  PowerOff,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  requestsPerMinute: number;
  requestsPerDay: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export default function ApiKeysClient({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setVisible((s) => {
      const n = new Set(s);

      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }

      return n;
    });
  };

  const copyKey = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleStatus = async (key: ApiKey) => {
    await fetch(`/api/keys/${key.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !key.isActive }),
    });

    setKeys((k) => k.map((x) => (x.id === key.id ? { ...x, isActive: !x.isActive } : x)));
  };

  const confirmDelete = async () => {
    if (!keyToDelete) return;

    try {
      await fetch(`/api/keys/${keyToDelete}`, { method: 'DELETE' });
      setKeys((k) => k.filter((x) => x.id !== keyToDelete));
    } catch (error) {
      console.error('Failed to delete key:', error);
    } finally {
      setKeyToDelete(null);
    }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!res.ok) throw new Error('Failed to create key');

      const { apiKey } = await res.json();
      setKeys((prev) => [apiKey, ...prev]);
      setIsCreateOpen(false);
      setNewKeyName('');
    } catch (error) {
      alert(`Failed to create API key: ${error}`);
    } finally {
      setIsCreating(false);
    }
  };

  const mask = (k: string) => `${k.slice(0, 10)}•••••••••••••••••••••••••${k.slice(-6)}`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
          <p className="text-sm text-slate-600">Manage and monitor your API keys</p>
        </div>

        <Button
          className="bg-slate-900 text-white hover:bg-slate-800"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access the Guardrails API.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Production App 1"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createKey} disabled={isCreating || !newKeyName.trim()}>
                {isCreating ? 'Creating...' : 'Create Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      {keys.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Key className="mx-auto mb-4 h-14 w-14 text-slate-300" />
            <p className="text-slate-600">No API keys created yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    API Key
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">RPM</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">RPD</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Last Used
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                    Expires
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {keys.map((k) => {
                  const show = visible.has(k.id);
                  const expired = k.expiresAt ? new Date(k.expiresAt) < new Date() : false;

                  return (
                    <tr key={k.id} className="border-b hover:bg-slate-50">
                      {/* Name */}
                      <td className="px-4 py-4 font-medium text-slate-900">{k.name}</td>

                      {/* API Key (NO SHIFT) */}
                      <td className="px-4 py-4">
                        <div className="w-[388px] rounded-md bg-slate-100 px-3 py-2 font-mono text-xs">
                          {show ? k.key : mask(k.key)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <Badge
                          className={
                            k.isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                          }
                        >
                          {k.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      {/* RPM */}
                      <td className="px-4 py-4 text-right text-sm text-slate-700">
                        {k.requestsPerMinute.toLocaleString()}
                      </td>

                      {/* RPD */}
                      <td className="px-4 py-4 text-right text-sm text-slate-700">
                        {k.requestsPerDay.toLocaleString()}
                      </td>

                      {/* Created */}
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {new Date(k.createdAt).toLocaleDateString()}
                      </td>

                      {/* Last Used */}
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : '—'}
                      </td>

                      {/* Expires */}
                      <td className="px-4 py-4 text-sm">
                        {k.expiresAt ? (
                          <span className={expired ? 'font-medium text-red-600' : 'text-slate-600'}>
                            {new Date(k.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">Never</span>
                        )}
                      </td>

                      {/* Actions (FIXED WIDTH) */}
                      <td className="px-4 py-4">
                        <div className="flex w-[160px] justify-end gap-1">
                          {/* Analytics */}
                          <Link href={`/ dashboard / api - keys / ${k.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View analytics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </Link>

                          {/* Show / Hide */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleVisibility(k.id)}
                          >
                            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>

                          {/* Copy */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => copyKey(k.key, k.id)}
                          >
                            {copied === k.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleStatus(k)}>
                                {k.isActive ? (
                                  <>
                                    <PowerOff className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Power className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  setKeyToDelete(k.id);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Best practices */}
      <Card className="mt-6 bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            API Key Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>• Store keys securely</p>
          <p>• Rotate keys regularly</p>
          <p>• Use separate keys per environment</p>
          <p>• Revoke unused keys</p>
        </CardContent>
      </Card>

      <AlertDialog open={!!keyToDelete} onOpenChange={(open) => !open && setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the API key and revoke all
              access immediately. Any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
