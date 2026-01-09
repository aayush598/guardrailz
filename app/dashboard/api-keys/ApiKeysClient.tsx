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
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  requestsPerMinute: number;
  requestsPerDay: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

export default function ApiKeysClient({
  initialKeys,
}: {
  initialKeys: ApiKey[];
}) {
  const [keys, setKeys] = useState(initialKeys);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setVisible((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
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

    setKeys((k) =>
      k.map((x) =>
        x.id === key.id ? { ...x, isActive: !x.isActive } : x
      )
    );
  };

  const deleteKey = async (id: string) => {
    if (!confirm('Delete this API key?')) return;
    await fetch(`/api/keys/${id}`, { method: 'DELETE' });
    setKeys((k) => k.filter((x) => x.id !== id));
  };

  const mask = (k: string) =>
    `${k.slice(0, 10)}••••••••••••${k.slice(-6)}`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
          <p className="text-sm text-slate-600">
            Manage and monitor your API keys
          </p>
        </div>

        <Button className="bg-slate-900 hover:bg-slate-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Table */}
      {keys.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Key className="h-14 w-14 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600">No API keys created yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Name</th>
                  <th className="px-4 py-3 text-left text-sm">Key</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-right text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => {
                  const show = visible.has(k.id);
                  return (
                    <tr key={k.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{k.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {show ? k.key : mask(k.key)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            k.isActive
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100'
                          }
                        >
                          {k.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1 items-center">
                            {/* 🔹 Analytics */}
                            <Link href={`/dashboard/api-keys/${k.id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                title="View analytics"
                                className="hover:bg-slate-100"
                            >
                                <BarChart3 className="h-4 w-4" />
                            </Button>
                            </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(k.id)}
                          >
                            {show ? <EyeOff /> : <Eye />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyKey(k.key, k.id)}
                          >
                            {copied === k.id ? <Check /> : <Copy />}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => toggleStatus(k)}
                              >
                                {k.isActive ? (
                                  <>
                                    <PowerOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Power className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteKey(k.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
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
        <CardContent className="text-sm space-y-1">
          <p>• Store keys securely</p>
          <p>• Rotate keys regularly</p>
          <p>• Use separate keys per environment</p>
          <p>• Revoke unused keys</p>
        </CardContent>
      </Card>
    </div>
  );
}
