import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Hiển thị trạng thái danh sách rỗng
export default function EmptyState({
  title = 'Không có dữ liệu',
  description = '',
  actionLabel = 'Thử lại',
  onAction,
  icon = 'inbox',
}) {
  return (
    <View style={styles.container}>
      <AntDesign name={icon} size={48} color={colors.textTertiary} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onAction ? (
        <AppButton
          title={actionLabel}
          variant="outline"
          onPress={onAction}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  button: {
    marginTop: spacing.sm,
  },
});
