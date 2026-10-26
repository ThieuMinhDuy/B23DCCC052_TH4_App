const pad = n => String(n).padStart(2, '0');

// Định dạng chuỗi ngày tháng: dd/MM/yyyy hoặc dd/MM/yyyy HH:mm
export function formatDate(dateInput, includeTime = false) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const dateStr = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  if (!includeTime) return dateStr;
  return `${dateStr} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Định dạng thời gian theo chuẩn: HH:mm, dd/MM/yyyy
export function formatLastUpdated(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Kiểm tra hạn nộp đã quá hạn hay chưa
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}

// Tính số ngày còn lại đến hạn nộp
export function daysLeft(dueDate) {
  if (!dueDate) return 0;
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) return 0;
  const diffMs = d.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Kiểm tra bài tập có đến hạn trong 7 ngày tới không
export function isDueInNextDays(dueDate, days = 7) {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) return false;
  const now = Date.now();
  const maxTime = now + days * 24 * 60 * 60 * 1000;
  return d.getTime() >= now && d.getTime() <= maxTime;
}

// Chuyển số ngày trong tuần (2 - 8) sang nhãn tiếng Việt
export function getDayLabel(day) {
  const dayNum = Number(day);
  if (dayNum >= 2 && dayNum <= 7) {
    return `Thứ ${dayNum}`;
  }
  if (dayNum === 8) {
    return 'Chủ nhật';
  }
  return '';
}

// Lấy số dayOfWeek của ngày hôm nay (2 = Thứ 2, ..., 8 = Chủ nhật)
export function getTodayDayOfWeek() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 8 : jsDay + 1;
}

// Định dạng ngày giờ: dd/MM/yyyy HH:mm
export function formatDateTime(iso) {
  return formatDate(iso, true);
}

// Lấy thông tin hạn chót bài tập
export function getDeadlineInfo(deadline) {
  if (!deadline) return { isOverdue: false, isSoon: false, daysLeft: 0 };
  const d = new Date(deadline);
  const diff = d.getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return {
    isOverdue: diff < 0,
    isSoon: diff >= 0 && days <= 3,
    daysLeft: days,
  };
}

export const SessionStatusLabels = {
  ended: 'Đã kết thúc',
  ongoing: 'Đang học',
  upcoming: 'Sắp diễn ra',
};

// Xác định trạng thái buổi học
export function getSessionStatus(dayOfWeek, startTime, endTime) {
  const today = getTodayDayOfWeek();
  const dayNum = typeof dayOfWeek === 'number' ? dayOfWeek : 2;
  if (dayNum !== today) {
    return 'upcoming';
  }
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = (startTime || '00:00').split(':').map(Number);
  const [eh, em] = (endTime || '00:00').split(':').map(Number);
  if (currentMinutes >= eh * 60 + em) {
    return 'ended';
  }
  if (currentMinutes >= sh * 60 + sm) {
    return 'ongoing';
  }
  return 'upcoming';
}

export default {
  formatDate,
  formatDateTime,
  formatLastUpdated,
  isOverdue,
  daysLeft,
  isDueInNextDays,
  getDayLabel,
  getTodayDayOfWeek,
  getDeadlineInfo,
  getSessionStatus,
  SessionStatusLabels,
};
