"use client"
import { useEffect, useState } from 'react';
import { 
  Shield, Key, Plus, Copy, Check, Trash2, Eye, EyeOff, 
  MoreVertical, BarChart3, Calendar, Clock, TrendingUp,
  FileCode, Activity, Settings, Home, Menu, X, RefreshCw,
  Edit2, Power, PowerOff, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
  usageToday?: number;
  usageMinute?: number;
}


export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyOpen, setNewKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingKey, setRenamingKey] = useState<ApiKey | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
  setLoading(true);
  try {
    const [keysRes, usageRes] = await Promise.all([
      fetch('/api/keys'),
      fetch('/api/usage/keys'),
    ]);

    if (!keysRes.ok || !usageRes.ok) {
      throw new Error('Failed to load API data');
    }

    const { apiKeys } = await keysRes.json();
    const usage = await usageRes.json();

    const enriched = apiKeys.map((key: ApiKey) => ({
      ...key,
      usageToday: usage.perDay[key.id] ?? 0,
      usageMinute: usage.perMinute[key.id] ?? 0,
    }));

    setApiKeys(enriched);
  } catch (error) {
    console.error(error);
    alert('Failed to load API keys');
  } finally {
    setLoading(false);
  }
};


  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    setCreatingKey(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create API key');
      }

      const data = await res.json();
      setApiKeys([data.apiKey, ...apiKeys]);
      setNewKeyOpen(false);
      setNewKeyName('');
      
      navigator.clipboard.writeText(data.apiKey.key);
      setCopiedKey(data.apiKey.id);
      setTimeout(() => setCopiedKey(null), 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const deleteApiKey = async (id: string, name: string) => {
  if (!confirm(`Delete API key "${name}"? This cannot be undone.`)) return;

  try {
    const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();

    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  } catch {
    alert('Failed to delete API key');
  }
};


  const toggleKeyStatus = async (key: ApiKey) => {
  try {
    const res = await fetch(`/api/keys/${key.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !key.isActive }),
    });

    if (!res.ok) throw new Error('Failed to update key');

    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === key.id ? { ...k, isActive: !k.isActive } : k
      )
    );
  } catch (err) {
    alert('Failed to update API key');
  }
};


  const openRenameDialog = (key: ApiKey) => {
    setRenamingKey(key);
    setNewName(key.name);
    setRenameDialogOpen(true);
  };

  const renameApiKey = async () => {
  if (!renamingKey || !newName.trim()) return;

  try {
    const res = await fetch(`/api/keys/${renamingKey.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });

    if (!res.ok) throw new Error('Failed to rename key');

    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === renamingKey.id ? { ...k, name: newName } : k
      )
    );

    setRenameDialogOpen(false);
    setRenamingKey(null);
  } catch (err) {
    alert('Failed to rename API key');
  }
};


  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 8);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const NavLink = ({ icon: Icon, children, active = false }: any) => (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-slate-100 text-slate-900 font-medium'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
      onClick={() => setSidebarOpen(false)}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-slate-900 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-slate-900" />
              <span className="text-xl font-bold text-slate-900">Guardrailz</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavLink icon={Home}>Overview</NavLink>
            <NavLink icon={Key} active>API Keys</NavLink>
            <NavLink icon={FileCode}>Profiles</NavLink>
            <NavLink icon={Activity}>Playground</NavLink>
            <NavLink icon={BarChart3}>Analytics</NavLink>
            <NavLink icon={Settings}>Settings</NavLink>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-900">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">John Doe</p>
                <p className="text-xs text-slate-500">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
                <p className="text-sm text-slate-600">Manage and monitor your API keys</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchApiKeys}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={newKeyOpen} onOpenChange={setNewKeyOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Give your API key a memorable name
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Key Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Production API Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !creatingKey && createApiKey()}
                      />
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription className="text-xs">
                        Your API key will be shown only once. Copy it immediately.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewKeyOpen(false)} disabled={creatingKey}>
                      Cancel
                    </Button>
                    <Button onClick={createApiKey} disabled={creatingKey} className="bg-slate-900 hover:bg-slate-800">
                      {creatingKey ? 'Creating...' : 'Create Key'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Keys
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {apiKeys.length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Active Keys
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {apiKeys.filter(k => k.isActive).length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {apiKeys.reduce((acc, k) => acc + (k.usageToday || 0), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Avg Rate Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {apiKeys.length > 0 ? Math.round(apiKeys.reduce((acc, k) => acc + k.requestsPerMinute, 0) / apiKeys.length) : 0}/min
                </div>
              </CardContent>
            </Card>
          </div>

          {apiKeys.length === 0 ? (
            <Card className="border-slate-200 bg-white">
              <CardContent className="py-16">
                <div className="text-center">
                  <Key className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    No API Keys Yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Create your first API key to get started
                  </p>
                  <Button onClick={() => setNewKeyOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">Name</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">API Key</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">Created</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">Last Used</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">Usage Today</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">Usage per min</th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => {
                      const isVisible = visibleKeys.has(key.id);
                      const usagePercent = ((key.usageToday || 0) / key.requestsPerDay) * 100;

                      return (
                        <tr key={key.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-slate-900">{key.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <code className="text-xs font-mono text-slate-600">
                                {isVisible ? key.key : maskKey(key.key)}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-slate-100"
                                onClick={() => toggleKeyVisibility(key.id)}
                              >
                                {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-slate-100"
                                onClick={() => copyToClipboard(key.key, key.id)}
                              >
                                {copiedKey === key.id ? (
                                  <Check className="h-3.5 w-3.5 text-slate-900" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={key.isActive ? 'default' : 'secondary'} className={key.isActive ? 'bg-slate-900 text-white border-0' : 'bg-slate-100 text-slate-700 border-0'}>
                              {key.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            {formatDate(key.createdAt)}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            {formatDate(key.lastUsedAt)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-slate-900 font-medium">
                                  {(key.usageToday || 0).toLocaleString()}
                                </span>
                                <span className="text-xs text-slate-500">/ {key.requestsPerDay.toLocaleString()}</span>
                              </div>
                              <div className="w-24 bg-slate-200 rounded-full h-1.5">
                                <div
                                  className="bg-slate-900 h-1.5 rounded-full transition-all"
                                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium text-slate-900">
                                  {key.usageMinute?.toLocaleString() ?? 0}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {' '} / {key.requestsPerMinute}
                                </span>
                              </div>
                              <div className="w-24 bg-slate-200 rounded-full h-1.5">
                                <div
                                  className="bg-slate-900 h-1.5 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      ((key.usageMinute ?? 0) / key.requestsPerMinute) * 100,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100"
                                title="View Analytics"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => openRenameDialog(key)}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleKeyStatus(key)}>
                                    {key.isActive ? (
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
                                    onClick={() => deleteApiKey(key.id, key.name)}
                                    className="text-slate-900"
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

          <Card className="mt-6 border-slate-200 bg-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <AlertCircle className="h-5 w-5 text-slate-700" />
                <span>API Key Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>• Store API keys securely in environment variables, never in your codebase</p>
              <p>• Rotate keys regularly and revoke unused keys immediately</p>
              <p>• Use different keys for development, staging, and production environments</p>
              <p>• Monitor usage patterns to detect unauthorized access</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename API Key</DialogTitle>
            <DialogDescription>
              Enter a new name for "{renamingKey?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename">New Name</Label>
            <Input
              id="rename"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={renameApiKey} className="bg-slate-900 hover:bg-slate-800">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}