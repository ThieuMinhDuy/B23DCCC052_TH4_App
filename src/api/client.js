import { BASE_URL, TIMEOUT } from '../config';

// Hàm gửi yêu cầu HTTP chung có kiểm tra mã lỗi và timeout 10 giây
export async function request(method, url, body = null, headers = {}) {
  const fullUrl = url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  const options = {
    method: (method || 'GET').toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    signal: controller.signal,
  };

  if (body && options.method !== 'GET' && options.method !== 'HEAD') {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Yêu cầu thất bại với mã lỗi HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {}

      const errorObj = {
        type: 'http',
        status: response.status,
        message: errorMessage,
      };
      throw errorObj;
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.type === 'http') {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw {
        type: 'timeout',
        status: 408,
        message: 'Hết thời gian chờ kết nối máy chủ (10 giây)',
      };
    }

    throw {
      type: 'network',
      status: 0,
      message: err.message || 'Không thể kết nối tới máy chủ',
    };
  }
}

export default {
  request,
};
