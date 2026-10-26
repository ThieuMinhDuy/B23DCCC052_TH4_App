import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './keys';

// Lấy toàn bộ danh sách thao tác trong hàng đợi outbox (theo thứ tự thêm vào)
export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.OUTBOX_QUEUE);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

// Thêm một thao tác vào cuối hàng đợi { id, method, url, body, createdAt }
export async function enqueue(action) {
  try {
    const queue = await getAll();
    const item = {
      id: action.id || `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      method: (action.method || 'POST').toUpperCase(),
      url: action.url,
      body: action.body || null,
      createdAt: action.createdAt || new Date().toISOString(),
    };
    queue.push(item);
    await AsyncStorage.setItem(KEYS.OUTBOX_QUEUE, JSON.stringify(queue));
    return item;
  } catch (error) {
    return null;
  }
}

// Xóa một thao tác khỏi hàng đợi sau khi gửi thành công
export async function remove(id) {
  try {
    const queue = await getAll();
    const filtered = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(KEYS.OUTBOX_QUEUE, JSON.stringify(filtered));
    return true;
  } catch (error) {
    return false;
  }
}

// Xóa toàn bộ hàng đợi outbox
export async function clear() {
  try {
    await AsyncStorage.removeItem(KEYS.OUTBOX_QUEUE);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getAll,
  enqueue,
  remove,
  clear,
};
