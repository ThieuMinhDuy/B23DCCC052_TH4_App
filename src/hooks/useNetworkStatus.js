import { useState, useEffect } from 'react';

let NetInfo = null;
try {
  const module = require('@react-native-community/netinfo');
  NetInfo = module.default || module;
} catch (e) {
  NetInfo = null;
}

// Hook theo dõi trạng thái kết nối mạng của thiết bị
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!NetInfo) {
      return;
    }

    try {
      const updateState = state => {
        const online = Boolean(state.isConnected && state.isInternetReachable !== false);
        setIsOnline(online);
      };

      NetInfo.fetch().then(updateState).catch(() => {});
      const unsubscribe = NetInfo.addEventListener(updateState);

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (err) {}
  }, []);

  return { isOnline };
}

export default useNetworkStatus;
