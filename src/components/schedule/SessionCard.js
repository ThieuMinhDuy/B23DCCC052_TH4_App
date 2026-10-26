import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Thẻ hiển thị một buổi học trong thời khóa biểu
function SessionCardComponent({ session, onPress }) {
  if (!session) return null;

  const courseName = session.course?.name || `Môn học #${session.courseId}`;

  return (
    <TouchableOpacity
      accessibilityLabel={`Buổi học ${courseName}`}
      accessibilityRole="button"
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.card}>
      <View style={styles.timeBadge}>
        <AntDesign name="clockcircleo" size={14} color={colors.primary} style={styles.icon} />
        <Text style={styles.timeText}>
          {session.startTime} - {session.endTime}
        </Text>
      </View>

      <Text style={styles.courseName} numberOfLines={2}>
        {courseName}
      </Text>

      <View style={styles.footer}>
        <View style={styles.roomBadge}>
          <AntDesign name="enviromento" size={14} color={colors.textMuted} style={styles.icon} />
          <Text style={styles.roomText}>{session.room}</Text>
        </View>
        {session.note ? (
          <Text style={styles.noteText} numberOfLines={1}>
            {session.note}
          </Text>
        ) : null}
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
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs,
  },
  timeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  courseName: {
    ...typography.h4,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  noteText: {
    ...typography.caption,
    color: colors.textTertiary,
    maxWidth: '50%',
  },
});

export default React.memo(SessionCardComponent);
