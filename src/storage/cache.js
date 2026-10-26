import AsyncStorage from '@react-native-async-storage/async-storage';

// Lấy dữ liệu cache kèm thời điểm lưu { data, savedAt }
export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

// Lưu dữ liệu vào cache kèm thời điểm hiện tại dạng ISO 8601
export async function setCache(key, data) {
  try {
    const payload = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
    return payload;
  } catch (error) {
    return null;
  }
}

// Xóa cache theo khóa
export async function removeCache(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {}
}

export default {
  getCache,
  setCache,
  removeCache,
};
