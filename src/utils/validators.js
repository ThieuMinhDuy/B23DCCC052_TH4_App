// Kiểm tra tiêu đề bài tập không được rỗng
export function validateAssignmentTitle(title) {
  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'Tiêu đề bài tập không được để trống';
  }
  return null;
}

// Kiểm tra hạn nộp bài tập không được ở quá khứ
export function validateDueDate(dueDate) {
  if (!dueDate) {
    return 'Hạn nộp không được để trống';
  }
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    return 'Định dạng hạn nộp không hợp lệ';
  }
  if (date.getTime() < Date.now()) {
    return 'Hạn nộp không được ở quá khứ';
  }
  return null;
}

// Kiểm tra toàn bộ form bài tập mới
export function validateAssignmentForm(form = {}) {
  const errors = {};
  const titleError = validateAssignmentTitle(form.title);
  if (titleError) errors.title = titleError;

  const dueDateError = validateDueDate(form.dueDate);
  if (dueDateError) errors.dueDate = dueDateError;

  if (!form.courseId) {
    errors.courseId = 'Vui lòng chọn môn học';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Kiểm tra email hợp lệ
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email không được để trống';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Email không đúng định dạng';
  }
  return null;
}

// Kiểm tra số điện thoại hợp lệ (10-11 chữ số)
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Số điện thoại không được để trống';
  }
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.trim().replace(/\s/g, ''))) {
    return 'Số điện thoại phải từ 10 đến 11 chữ số';
  }
  return null;
}

// Kiểm tra form thông tin sinh viên
export function validateProfileForm(form = {}) {
  const errors = {};
  if (!form.fullName || !form.fullName.trim()) {
    errors.fullName = 'Họ và tên không được để trống';
  }

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(form.phone);
  if (phoneError) errors.phone = phoneError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default {
  validateAssignmentTitle,
  validateDueDate,
  validateAssignmentForm,
  validateEmail,
  validatePhone,
  validateProfileForm,
};
