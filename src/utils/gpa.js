// Quy đổi điểm hệ 10 sang điểm hệ 4
export function toScale4(score10) {
  const score = Number(score10);
  if (isNaN(score)) return 0;
  if (score >= 8.5) return 4.0;
  if (score >= 8.0) return 3.5;
  if (score >= 7.0) return 3.0;
  if (score >= 6.5) return 2.5;
  if (score >= 5.5) return 2.0;
  if (score >= 5.0) return 1.5;
  if (score >= 4.0) return 1.0;
  return 0.0;
}

// Quy đổi điểm hệ 10 sang điểm chữ
export function toLetterGrade(score10) {
  const score = Number(score10);
  if (isNaN(score)) return 'F';
  if (score >= 8.5) return 'A';
  if (score >= 8.0) return 'B+';
  if (score >= 7.0) return 'B';
  if (score >= 6.5) return 'C+';
  if (score >= 5.5) return 'C';
  if (score >= 5.0) return 'D+';
  if (score >= 4.0) return 'D';
  return 'F';
}

// Tính GPA hệ 4 có trọng số tín chỉ và tổng tín chỉ tích lũy (bỏ qua điểm F)
export function calcGpa(grades = [], courses = []) {
  if (!Array.isArray(grades) || grades.length === 0) {
    return { gpa: 0.0, totalCredits: 0 };
  }

  let totalWeightedScore = 0;
  let totalCreditsForGpa = 0;
  let accumulatedCredits = 0;

  const courseMap = new Map();
  if (Array.isArray(courses)) {
    courses.forEach(c => {
      if (c && c.id) {
        courseMap.set(c.id, c);
      }
    });
  }

  grades.forEach(grade => {
    if (!grade) return;
    const course = grade.course || courseMap.get(grade.courseId);
    const credits = Number(grade.credits || course?.credits || 0);
    const totalScore10 = Number(grade.total !== undefined ? grade.total : grade.totalScore10 || 0);
    const scale4 = toScale4(totalScore10);

    if (credits > 0) {
      totalWeightedScore += scale4 * credits;
      totalCreditsForGpa += credits;
      if (scale4 > 0) {
        accumulatedCredits += credits;
      }
    }
  });

  const gpa = totalCreditsForGpa > 0 ? totalWeightedScore / totalCreditsForGpa : 0;
  return {
    gpa: Number(gpa.toFixed(2)),
    totalCredits: accumulatedCredits,
  };
}

// Tính điểm trung bình hệ 10
export function computeGpa10(grades = []) {
  if (!Array.isArray(grades) || grades.length === 0) return 0;
  const totalCredits = grades.reduce((sum, g) => sum + (g.credits || 0), 0);
  if (totalCredits === 0) return 0;
  const weighted = grades.reduce((sum, g) => sum + ((g.total || g.totalScore10 || 0) * (g.credits || 0)), 0);
  return weighted / totalCredits;
}

// Tính tổng số tín chỉ
export function computeTotalCredits(grades = []) {
  if (!Array.isArray(grades)) return 0;
  return grades.reduce((sum, g) => sum + (g.credits || 0), 0);
}

export default {
  toScale4,
  toLetterGrade,
  calcGpa,
  computeGpa10,
  computeTotalCredits,
};
