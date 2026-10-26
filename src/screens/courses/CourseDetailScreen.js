import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import courseService from '../../api/courseService';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình chi tiết môn học hiển thị thông tin, lịch học và bài tập liên quan
export default function CourseDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const {
    courses,
    sessions,
    assignments,
    pendingAssignmentIds,
    toggleAssignmentStatus,
  } = useAppData();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải chi tiết môn học theo id truyền qua route params
  const fetchDetail = async () => {
    setLoading(true);
    // Ưu tiên hiển thị dữ liệu từ cache trước
    const cachedCourse = courses.find(c => c.id === Number(id));
    if (cachedCourse) {
      setCourse(cachedCourse);
      navigation.setOptions({ title: cachedCourse.name });
      setLoading(false);
    }

    try {
      const data = await courseService.getById(id);
      setCourse(data);
      navigation.setOptions({ title: data.name });
      setError(null);
    } catch (err) {
      if (!cachedCourse) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết môn học…" />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const courseSessions = sessions.filter(s => s.courseId === Number(id));
  const courseAssignments = assignments.filter(a => a.courseId === Number(id));

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      {/* Thẻ thông tin chung môn học */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{course?.code}</Text>
          </View>
          <Text style={styles.semesterText}>{course?.semester}</Text>
        </View>

        <Text style={styles.name}>{course?.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AntDesign name="book" size={14} color={colors.primary} style={styles.metaIcon} />
            <Text style={styles.metaText}>{course?.credits} tín chỉ</Text>
          </View>
          <View style={styles.metaItem}>
            <AntDesign name="user" size={14} color={colors.primary} style={styles.metaIcon} />
            <Text style={styles.metaText}>{course?.lecturer}</Text>
          </View>
        </View>

        {course?.description ? (
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>Mô tả môn học</Text>
            <Text style={styles.descText}>{course.description}</Text>
          </View>
        ) : null}
      </View>

      {/* Danh sách lịch học của môn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lịch học môn này</Text>
        {courseSessions.length > 0 ? (
          courseSessions.map(sess => (
            <SessionCard
              key={sess.id}
              session={sess}
              onPress={() =>
                navigation.navigate(ROUTES.SESSION_DETAIL, { id: sess.id })
              }
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Chưa có lịch học cho môn này.</Text>
        )}
      </View>

      {/* Danh sách bài tập của môn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bài tập môn học ({courseAssignments.length})</Text>
        {courseAssignments.length > 0 ? (
          courseAssignments.map(asgn => (
            <AssignmentItem
              key={asgn.id}
              assignment={asgn}
              pending={pendingAssignmentIds.has(asgn.id)}
              onPress={() =>
                navigation.navigate(ROUTES.HOME_ASSIGNMENT_DETAIL, { id: asgn.id })
              }
              onToggleStatus={() => toggleAssignmentStatus(asgn.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Môn học này chưa có bài tập nào.</Text>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  semesterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  descBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  descTitle: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: 4,
  },
  descText: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  section: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
});
