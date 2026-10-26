import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Mục bài tập hiển thị trạng thái hoàn thành và nhãn chưa đồng bộ
function AssignmentItemComponent({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}) {
  if (!assignment) return null;

  const isDone = assignment.status === 'done';
  const overdue = !isDone && isOverdue(assignment.dueDate);
  const courseName = assignment.course?.name || `Môn học #${assignment.courseId}`;

  return (
    <TouchableOpacity
      accessibilityLabel={`Bài tập ${assignment.title}`}
      accessibilityRole="button"
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, overdue && styles.cardOverdue]}>
      <StatusToggle status={assignment.status} onToggle={onToggleStatus} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.title, isDone && styles.titleDone, overdue && styles.titleOverdue]}
            numberOfLines={2}>
            {assignment.title}
          </Text>
          <SyncBadge pending={pending} />
        </View>

        <Text style={styles.courseName} numberOfLines={1}>
          {courseName}
        </Text>

        <View style={styles.dueRow}>
          <AntDesign
            name="calendar"
            size={12}
            color={overdue ? colors.error : colors.textMuted}
            style={styles.icon}
          />
          <Text style={[styles.dueText, overdue && styles.dueTextOverdue]}>
            {formatDate(assignment.dueDate, true)}
            {overdue ? ' (Quá hạn)' : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardOverdue: {
    borderColor: colors.errorLight,
    backgroundColor: '#FFF9F9',
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  titleOverdue: {
    color: colors.error,
  },
  courseName: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  icon: {
    marginRight: 4,
  },
  dueText: {
    ...typography.small,
    color: colors.textMuted,
  },
  dueTextOverdue: {
    color: colors.error,
    fontWeight: '600',
  },
});

export default React.memo(AssignmentItemComponent);
