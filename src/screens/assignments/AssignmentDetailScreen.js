import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import assignmentService from '../../api/assignmentService';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import StatusToggle from '../../components/assignment/StatusToggle';
import SyncBadge from '../../components/common/SyncBadge';
import AppButton from '../../components/common/AppButton';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình chi tiết bài tập
export default function AssignmentDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const {
    assignments,
    pendingAssignmentIds,
    toggleAssignmentStatus,
  } = useAppData();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải chi tiết bài tập theo id
  const fetchDetail = async () => {
    setLoading(true);
    const cachedItem = assignments.find(a => a.id === id || a.id === Number(id));
    if (cachedItem) {
      setAssignment(cachedItem);
      navigation.setOptions({ title: cachedItem.title });
      setLoading(false);
    }

    try {
      const data = await assignmentService.getById(id);
      setAssignment(data);
      navigation.setOptions({ title: data.title });
      setError(null);
    } catch (err) {
      if (!cachedItem) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // Đồng bộ trạng thái khi thay đổi từ context
  useEffect(() => {
    const updated = assignments.find(a => a.id === id || a.id === Number(id));
    if (updated) {
      setAssignment(updated);
    }
  }, [assignments, id]);

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const isDone = assignment?.status === 'done';
  const overdue = !isDone && isOverdue(assignment?.dueDate);
  const course = assignment?.course;
  const isPending = pendingAssignmentIds.has(assignment?.id);

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <StatusToggle
              status={assignment?.status}
              onToggle={() => toggleAssignmentStatus(assignment?.id)}
            />
            <Text style={[styles.statusText, isDone ? styles.statusDone : styles.statusTodo]}>
              {isDone ? 'Đã hoàn thành' : overdue ? 'Quá hạn nộp' : 'Chưa hoàn thành'}
            </Text>
          </View>
          <SyncBadge pending={isPending} />
        </View>

        <Text style={styles.title}>{assignment?.title}</Text>

        <View style={styles.metaRow}>
          <AntDesign name="book" size={16} color={colors.textMuted} style={styles.icon} />
          <Text style={styles.metaLabel}>Môn học:</Text>
          <Text style={styles.metaValue}>{course?.name || `Môn học #${assignment?.courseId}`}</Text>
        </View>

        <View style={styles.metaRow}>
          <AntDesign
            name="calendar"
            size={16}
            color={overdue ? colors.error : colors.textMuted}
            style={styles.icon}
          />
          <Text style={styles.metaLabel}>Hạn nộp:</Text>
          <Text style={[styles.metaValue, overdue && styles.overdueText]}>
            {formatDate(assignment?.dueDate, true)}
          </Text>
        </View>

        {assignment?.description ? (
          <View style={styles.descBox}>
            <Text style={styles.descTitle}>Nội dung mô tả</Text>
            <Text style={styles.descText}>{assignment.description}</Text>
          </View>
        ) : null}

        {course?.id ? (
          <AppButton
            title="Xem thông tin môn học"
            variant="outline"
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
            }
            style={styles.actionButton}
          />
        ) : null}
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
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...typography.bodyBold,
    marginLeft: spacing.xs,
  },
  statusDone: {
    color: colors.success,
  },
  statusTodo: {
    color: colors.warning,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  icon: {
    marginRight: spacing.sm,
    width: 20,
  },
  metaLabel: {
    ...typography.body,
    color: colors.textMuted,
    width: 70,
  },
  metaValue: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  overdueText: {
    color: colors.error,
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
  actionButton: {
    marginTop: spacing.lg,
  },
});
