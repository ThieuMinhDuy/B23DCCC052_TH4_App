import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Một dòng hiển thị kết quả học tập môn học
function GradeRowComponent({ grade, onPress }) {
  if (!grade) return null;

  const courseName = grade.course?.name || `Môn học #${grade.courseId}`;
  const credits = grade.course?.credits || grade.credits || 3;
  const total = Number(grade.total !== undefined ? grade.total : grade.totalScore10 || 0).toFixed(2);
  const letter = grade.letter || grade.letterGrade || '-';

  return (
    <TouchableOpacity
      accessibilityLabel={`Xem chi tiết điểm ${courseName}`}
      accessibilityRole="button"
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.courseName} numberOfLines={1}>
          {courseName}
        </Text>
        <Text style={styles.creditsText}>{credits} tín chỉ</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.totalScore}>{total}</Text>
        <View style={styles.letterBadge}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
        <AntDesign name="right" size={14} color={colors.textTertiary} style={styles.arrow} />
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
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalScore: {
    ...typography.bodyBold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  letterBadge: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  letterText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  arrow: {
    marginLeft: 2,
  },
});

export default React.memo(GradeRowComponent);
