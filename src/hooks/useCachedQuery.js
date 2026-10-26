import { useState, useEffect, useCallback, useRef } from 'react';
import { getCache, setCache } from '../storage/cache';
import { useNetworkStatus } from './useNetworkStatus';

// Hook truy vấn dữ liệu theo chiến lược Cache trước, Mạng sau
export function useCachedQuery(key, fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { isOnline } = useNetworkStatus();
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    let hasCachedData = false;

    if (!isRefresh) {
      const cached = await getCache(key);
      if (cached && cached.data !== undefined) {
        setData(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
        hasCachedData = true;
      }
    }

    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
      const saved = await setCache(key, result);
      if (saved) {
        setLastUpdated(saved.savedAt);
      }
    } catch (err) {
      if (!hasCachedData && !isRefresh) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [key]);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
  };
}

export default useCachedQuery;
