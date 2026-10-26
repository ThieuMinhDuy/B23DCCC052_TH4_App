import React, { createContext, useContext } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useOutboxSync } from '../hooks/useOutboxSync';

const SyncContext = createContext(null);

// Provider quản lý trạng thái mạng và tiến trình đồng bộ outbox
export function SyncProvider({ children, onSyncSuccess }) {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, syncing, syncNow, refreshPendingCount } = useOutboxSync(onSyncSuccess);

  const value = {
    isOnline,
    pendingCount,
    syncing,
    syncNow,
    refreshPendingCount,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

// Hook sử dụng SyncContext
export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được sử dụng bên trong SyncProvider');
  }
  return context;
}

export default SyncContext;
