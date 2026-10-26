import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Thẻ hiển thị thông tin tóm tắt môn học
function CourseCardComponent({ course, onPress }) {
  if (!course) return null;

  return (
    <TouchableOpacity
      accessibilityLabel={`Môn học ${course.name}`}
      accessibilityRole="button"
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.header}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <Text style={styles.creditsText}>{course.credits} tín chỉ</Text>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {course.name}
      </Text>

      <View style={styles.footer}>
        <AntDesign name="user" size={14} color={colors.textMuted} style={styles.icon} />
        <Text style={styles.lecturer} numberOfLines={1}>
          {course.lecturer}
        </Text>
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
  },
  header: {
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
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    ...typography.h4,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs,
  },
  lecturer: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
});

export default React.memo(CourseCardComponent);
