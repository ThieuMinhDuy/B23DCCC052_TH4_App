import { request } from './client';

// Lấy danh sách điểm kèm thông tin môn học
export function getAll() {
  return request('GET', '/grades?_expand=course');
}

// Lấy chi tiết điểm của một môn theo id
export function getById(id) {
  return request('GET', `/grades/${id}?_expand=course`);
}

// Thêm bản ghi điểm mới
export function create(data) {
  return request('POST', '/grades', data);
}

// Cập nhật bản ghi điểm
export function update(id, data) {
  return request('PATCH', `/grades/${id}`, data);
}

export default {
  getAll,
  getById,
  create,
  update,
};
