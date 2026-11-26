'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { adminFetch, getIn, setIn, toast } from '@/lib/admin';

export function useSettingsEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    adminFetch('/admin/settings')
      .then(setData)
      .catch((e) => toast(e.message, 'error'));
  }, []);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const get = useCallback((path: string) => getIn(data, path), [data]);
  const set = useCallback((path: string, value: unknown) => {
    setData((d: any) => setIn(d, path, value));
    setDirty(true);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const saved = await adminFetch('/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
      setData(saved);
      setDirty(false);
      toast('Save hoyeche — website e update chole geche');
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return { data, get, set, save, saving, dirty };
}
