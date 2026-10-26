import { request } from './client';

// Lấy danh sách lịch học kèm thông tin môn học
export function getAll() {
  return request('GET', '/sessions?_expand=course');
}

// Lấy chi tiết một buổi học theo id
export function getById(id) {
  return request('GET', `/sessions/${id}?_expand=course`);
}

// Thêm buổi học mới
export function create(data) {
  return request('POST', '/sessions', data);
}

// Cập nhật buổi học
export function update(id, data) {
  return request('PATCH', `/sessions/${id}`, data);
}

export default {
  getAll,
  getById,
  create,
  update,
};
