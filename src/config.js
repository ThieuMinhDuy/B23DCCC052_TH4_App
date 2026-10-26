import { Platform } from 'react-native';

// Khi chạy trên Android Emulator: 10.0.2.2
// Khi chạy trên iOS Simulator: localhost
// Khi chạy trên thiết bị thật: thay bằng IP mạng LAN (ví dụ: 'http://192.168.1.5:3000')
const ANDROID_LOCAL_HOST = 'http://10.0.2.2:3000';
const DEFAULT_HOST = 'http://localhost:3000';

export const BASE_URL = Platform.OS === 'android' ? ANDROID_LOCAL_HOST : DEFAULT_HOST;

export const TIMEOUT = 10000; // 10 giây theo đặc tả A1

export const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 giờ cache TTL mặc định

export default {
  BASE_URL,
  TIMEOUT,
  CACHE_TTL,
};
