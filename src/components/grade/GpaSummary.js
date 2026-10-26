import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Bảng tóm tắt điểm trung bình tích lũy GPA và tổng tín chỉ
export default function GpaSummary({ gpa = 0, totalCredits = 0 }) {
  const formattedGpa = Number(gpa || 0).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <AntDesign name="Trophy" size={20} color={colors.primary} />
        </View>
        <Text style={styles.value}>{formattedGpa}</Text>
        <Text style={styles.label}>GPA Hệ 4</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <AntDesign name="book" size={20} color={colors.accent} />
        </View>
        <Text style={styles.value}>{totalCredits}</Text>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h2,
    color: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
