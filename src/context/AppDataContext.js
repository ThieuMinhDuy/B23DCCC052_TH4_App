import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { KEYS } from '../storage/keys';
import { getCache, setCache } from '../storage/cache';
import { enqueue, getAll as getOutboxActions } from '../storage/outbox';
import studentService from '../api/studentService';
import courseService from '../api/courseService';
import sessionService from '../api/sessionService';
import assignmentService from '../api/assignmentService';
import gradeService from '../api/gradeService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const AppDataContext = createContext(null);

// Provider quản lý dữ liệu toàn cục dùng chung cho cả 5 tab
export function AppDataProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pendingAssignmentIds, setPendingAssignmentIds] = useState(new Set());
  const [pendingProfileUpdate, setPendingProfileUpdate] = useState(false);

  const { isOnline } = useNetworkStatus();

  // Kiểm tra các thao tác đang chờ trong outbox để gắn nhãn Chưa đồng bộ
  const refreshPendingStatus = useCallback(async () => {
    const actions = await getOutboxActions();
    const pendingIds = new Set();
    let hasProfilePending = false;

    actions.forEach(act => {
      if (act.url?.includes('/assignments/')) {
        const parts = act.url.split('/');
        const id = parts[parts.length - 1];
        if (id) pendingIds.add(Number(id) || id);
      } else if (act.url === '/assignments' && act.method === 'POST') {
        if (act.body?.tempId) pendingIds.add(act.body.tempId);
      } else if (act.url?.includes('/students/')) {
        hasProfilePending = true;
      }
    });

    setPendingAssignmentIds(pendingIds);
    setPendingProfileUpdate(hasProfilePending);
  }, []);

  // Tải toàn bộ dữ liệu theo chiến lược cache trước, mạng sau
  const fetchAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    let hasCached = false;

    if (!isRefresh) {
      const [cStudent, cCourses, cSessions, cAssignments, cGrades] = await Promise.all([
        getCache(KEYS.CACHE_STUDENT),
        getCache(KEYS.CACHE_COURSES),
        getCache(KEYS.CACHE_SESSIONS),
        getCache(KEYS.CACHE_ASSIGNMENTS),
        getCache(KEYS.CACHE_GRADES),
      ]);

      if (cStudent?.data) setStudent(cStudent.data);
      if (cCourses?.data) setCourses(cCourses.data);
      if (cSessions?.data) setSessions(cSessions.data);
      if (cAssignments?.data) setAssignments(cAssignments.data);
      if (cGrades?.data) setGrades(cGrades.data);

      const savedTimes = [
        cStudent?.savedAt,
        cCourses?.savedAt,
        cSessions?.savedAt,
        cAssignments?.savedAt,
        cGrades?.savedAt,
      ].filter(Boolean);

      if (savedTimes.length > 0) {
        setLastUpdated(savedTimes[0]);
        setLoading(false);
        hasCached = true;
      }
    }

    await refreshPendingStatus();

    try {
      const [rStudent, rCourses, rSessions, rAssignments, rGrades] = await Promise.all([
        studentService.getProfile(),
        courseService.getAll(),
        sessionService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);

      setStudent(rStudent);
      setCourses(rCourses);
      setSessions(rSessions);
      setAssignments(rAssignments);
      setGrades(rGrades);
      setError(null);

      const now = new Date().toISOString();
      setLastUpdated(now);

      await Promise.all([
        setCache(KEYS.CACHE_STUDENT, rStudent),
        setCache(KEYS.CACHE_COURSES, rCourses),
        setCache(KEYS.CACHE_SESSIONS, rSessions),
        setCache(KEYS.CACHE_ASSIGNMENTS, rAssignments),
        setCache(KEYS.CACHE_GRADES, rGrades),
      ]);
    } catch (err) {
      if (!hasCached && !isRefresh) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshPendingStatus]);

  useEffect(() => {
    fetchAllData(false);
  }, [fetchAllData]);

  // Cập nhật lạc quan khi thay đổi trạng thái bài tập (todo <-> done)
  const toggleAssignmentStatus = useCallback(async (assignmentId) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (!target) return;

    const oldStatus = target.status;
    const newStatus = oldStatus === 'done' ? 'todo' : 'done';
    const nowIso = new Date().toISOString();

    const updatedList = assignments.map(a =>
      a.id === assignmentId ? { ...a, status: newStatus, updatedAt: nowIso } : a
    );
    setAssignments(updatedList);

    if (!isOnline) {
      await enqueue({
        method: 'PATCH',
        url: `/assignments/${assignmentId}`,
        body: { status: newStatus, updatedAt: nowIso },
      });
      setPendingAssignmentIds(prev => new Set(prev).add(assignmentId));
      await setCache(KEYS.CACHE_ASSIGNMENTS, updatedList);
      return;
    }

    try {
      await assignmentService.updateStatus(assignmentId, newStatus);
      await setCache(KEYS.CACHE_ASSIGNMENTS, updatedList);
    } catch (err) {
      const revertedList = assignments.map(a =>
        a.id === assignmentId ? { ...a, status: oldStatus } : a
      );
      setAssignments(revertedList);
      Alert.alert('Lỗi cập nhật', 'Không thể cập nhật trạng thái bài tập. Đã hoàn tác lại.');
    }
  }, [assignments, isOnline]);

  // Thêm bài tập mới (gửi POST hoặc đưa vào outbox nếu offline)
  const addAssignment = useCallback(async (newAssignmentData) => {
    const nowIso = new Date().toISOString();

    if (!isOnline) {
      const tempId = `temp_${Date.now()}`;
      const course = courses.find(c => c.id === Number(newAssignmentData.courseId));
      const optimisticItem = {
        id: tempId,
        ...newAssignmentData,
        courseId: Number(newAssignmentData.courseId),
        course,
        status: 'todo',
        updatedAt: nowIso,
        isPending: true,
      };

      const updated = [optimisticItem, ...assignments];
      setAssignments(updated);
      setPendingAssignmentIds(prev => new Set(prev).add(tempId));

      await enqueue({
        method: 'POST',
        url: '/assignments',
        body: {
          ...newAssignmentData,
          courseId: Number(newAssignmentData.courseId),
          status: 'todo',
          updatedAt: nowIso,
          tempId,
        },
      });

      await setCache(KEYS.CACHE_ASSIGNMENTS, updated);
      return optimisticItem;
    }

    try {
      const created = await assignmentService.create({
        ...newAssignmentData,
        courseId: Number(newAssignmentData.courseId),
        status: 'todo',
      });
      const course = courses.find(c => c.id === Number(newAssignmentData.courseId));
      const withCourse = { ...created, course };
      const updated = [withCourse, ...assignments];
      setAssignments(updated);
      await setCache(KEYS.CACHE_ASSIGNMENTS, updated);
      return withCourse;
    } catch (err) {
      throw err;
    }
  }, [assignments, courses, isOnline]);

  // Cập nhật thông tin sinh viên (gửi PATCH hoặc lưu outbox nếu offline)
  const updateStudentProfile = useCallback(async (profileData) => {
    const nowIso = new Date().toISOString();
    const updatedStudent = {
      ...student,
      ...profileData,
      updatedAt: nowIso,
    };
    setStudent(updatedStudent);

    if (!isOnline) {
      await enqueue({
        method: 'PATCH',
        url: '/students/1',
        body: {
          ...profileData,
          updatedAt: nowIso,
        },
      });
      setPendingProfileUpdate(true);
      await setCache(KEYS.CACHE_STUDENT, updatedStudent);
      return;
    }

    try {
      const result = await studentService.updateProfile(profileData);
      setStudent(result);
      await setCache(KEYS.CACHE_STUDENT, result);
    } catch (err) {
      throw err;
    }
  }, [isOnline, student]);

  const value = {
    student,
    courses,
    sessions,
    assignments,
    grades,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingAssignmentIds,
    pendingProfileUpdate,
    fetchAllData,
    toggleAssignmentStatus,
    addAssignment,
    updateStudentProfile,
    refreshPendingStatus,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// Hook sử dụng AppDataContext
export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được sử dụng bên trong AppDataProvider');
  }
  return context;
}

export default AppDataContext;
