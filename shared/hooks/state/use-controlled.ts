import { useState } from 'react';

export function useControlled<T>(controlled: T | undefined, defaultValue: T) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;

  const setValue = (next: T) => {
    if (controlled === undefined) {
      setInternal(next);
    }
  };

  return [value, setValue] as const;
}
