import { request } from './client';

// Lấy thông tin sinh viên theo id
export function getById(id = 1) {
  return request('GET', `/students/${id}`);
}

// Cập nhật thông tin sinh viên
export function update(id = 1, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return request('PATCH', `/students/${id}`, payload);
}

// Lấy hồ sơ sinh viên mặc định (id = 1)
export function getProfile() {
  return getById(1);
}

// Cập nhật hồ sơ sinh viên mặc định (id = 1)
export function updateProfile(data) {
  return update(1, data);
}

export default {
  getById,
  update,
  getProfile,
  updateProfile,
};
