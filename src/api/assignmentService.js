import { request } from './client';

// Lấy danh sách bài tập kèm môn học và sắp xếp theo hạn nộp
export function getAll() {
  return request('GET', '/assignments?_expand=course&_sort=dueDate');
}

// Lấy chi tiết bài tập theo id
export function getById(id) {
  return request('GET', `/assignments/${id}?_expand=course`);
}

// Thêm bài tập mới
export function create(data) {
  const payload = {
    ...data,
    status: data.status || 'todo',
    updatedAt: new Date().toISOString(),
  };
  return request('POST', '/assignments', payload);
}

// Cập nhật thông tin bài tập
export function update(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return request('PATCH', `/assignments/${id}`, payload);
}

// Cập nhật trạng thái hoàn thành bài tập (todo hoặc done)
export function updateStatus(id, status) {
  return update(id, { status });
}

export default {
  getAll,
  getById,
  create,
  update,
  updateStatus,
};
