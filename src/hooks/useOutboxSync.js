import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { getAll, remove } from '../storage/outbox';
import { request } from '../api/client';
import { useNetworkStatus } from './useNetworkStatus';

// Hook tự động đồng bộ hàng đợi outbox lên server khi có mạng lại kèm xử lý xung đột
export function useOutboxSync(onSyncSuccess) {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { isOnline } = useNetworkStatus();
  const prevOnlineRef = useRef(isOnline);
  const onSyncSuccessRef = useRef(onSyncSuccess);
  onSyncSuccessRef.current = onSyncSuccess;

  // Cập nhật số lượng thao tác đang chờ trong hàng đợi
  const updatePendingCount = useCallback(async () => {
    const list = await getAll();
    setPendingCount(list.length);
    return list;
  }, []);

  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  // Thực hiện đồng bộ toàn bộ hàng đợi outbox lên server
  const syncNow = useCallback(async () => {
    if (syncing || !isOnline) return;

    const queue = await getAll();
    if (!queue || queue.length === 0) {
      setPendingCount(0);
      return;
    }

    setSyncing(true);
    let successCount = 0;
    let conflictCount = 0;

    for (const action of queue) {
      try {
        let hasConflict = false;

        // Xử lý xung đột B5: Kiểm tra updatedAt trên server đối với các thao tác PATCH
        if (action.method === 'PATCH' && action.url) {
          try {
            const serverData = await request('GET', action.url);
            if (serverData && serverData.updatedAt) {
              const serverTime = new Date(serverData.updatedAt).getTime();
              const actionTime = new Date(action.body?.updatedAt || action.createdAt).getTime();

              if (serverTime > actionTime) {
                hasConflict = true;
                conflictCount++;
                await remove(action.id);
                Alert.alert(
                  'Xung đột dữ liệu',
                  `Dữ liệu mục "${serverData.fullName || serverData.title || 'bản ghi'}" trên máy chủ mới hơn thao tác ngoại tuyến. Hệ thống giữ lại bản ghi máy chủ.`
                );
              }
            }
          } catch (fetchErr) {
            // Không lấy được dữ liệu so sánh thì tiếp tục thử gửi bình thường
          }
        }

        if (!hasConflict) {
          await request(action.method, action.url, action.body);
          await remove(action.id);
          successCount++;
        }
      } catch (err) {
        // Gặp lỗi kết nối thì dừng chuỗi gửi để thử lại sau
        break;
      }
    }

    const remaining = await updatePendingCount();

    if (successCount > 0) {
      Alert.alert('Đồng bộ dữ liệu', `Đã đồng bộ ${successCount} thay đổi lên máy chủ.`);
      if (typeof onSyncSuccessRef.current === 'function') {
        onSyncSuccessRef.current();
      }
    }

    setSyncing(false);
  }, [isOnline, syncing, updatePendingCount]);

  // Tự động kích hoạt khi isOnline chuyển sang true
  useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      syncNow();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, syncNow]);

  return {
    pendingCount,
    syncing,
    syncNow,
    refreshPendingCount: updatePendingCount,
  };
}

export default useOutboxSync;
