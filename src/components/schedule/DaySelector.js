import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { day: 2, label: 'Thứ 2' },
  { day: 3, label: 'Thứ 3' },
  { day: 4, label: 'Thứ 4' },
  { day: 5, label: 'Thứ 5' },
  { day: 6, label: 'Thứ 6' },
  { day: 7, label: 'Thứ 7' },
  { day: 8, label: 'Chủ nhật' },
];

// Thanh chọn thứ trong tuần cho màn hình thời khóa biểu
export default function DaySelector({ selectedDay, onSelectDay }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {DAYS.map(item => {
        const isSelected = selectedDay === item.day;
        return (
          <TouchableOpacity
            key={item.day}
            accessibilityLabel={`Chọn ${item.label}`}
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => onSelectDay(item.day)}
            style={[styles.dayButton, isSelected && styles.dayButtonSelected]}>
            <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  dayButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  dayTextSelected: {
    color: colors.textWhite,
  },
});
