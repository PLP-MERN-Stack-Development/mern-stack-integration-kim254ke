import { useState, useEffect, useCallback } from 'react';

export default function useApi(apiFunc, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc();
      // Handle both possible shapes of response
      if (result && typeof result === 'object' && 'data' in result) {
        setData(result.data);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error('❌ useApi fetch error:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}
