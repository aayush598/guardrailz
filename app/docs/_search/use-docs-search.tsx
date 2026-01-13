'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface DocsSearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DocsSearchContext = createContext<DocsSearchContextValue | null>(null);

export function DocsSearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // ✅ GLOBAL keyboard listener (always mounted)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <DocsSearchContext.Provider value={{ open, setOpen }}>{children}</DocsSearchContext.Provider>
  );
}

export function useDocsSearch() {
  const ctx = useContext(DocsSearchContext);
  if (!ctx) {
    throw new Error('useDocsSearch must be used inside DocsSearchProvider');
  }
  return ctx;
}
