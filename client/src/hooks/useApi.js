import { useState, useEffect } from 'react';

export default function useApi(fn, deps = [], initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(initial === null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fn();
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, deps);

  return { data, setData, loading, error };
}
