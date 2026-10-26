import { request } from './client';

// Lấy danh sách tất cả môn học
export function getAll() {
  return request('GET', '/courses');
}

// Lấy chi tiết một môn học theo id
export function getById(id) {
  return request('GET', `/courses/${id}`);
}

// Thêm môn học mới
export function create(data) {
  return request('POST', '/courses', data);
}

// Cập nhật thông tin môn học
export function update(id, data) {
  return request('PATCH', `/courses/${id}`, data);
}

export default {
  getAll,
  getById,
  create,
  update,
};
