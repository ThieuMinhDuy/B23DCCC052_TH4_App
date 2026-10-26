import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Nhãn hiển thị trạng thái chưa đồng bộ lên máy chủ
export default function SyncBadge({ pending = false }) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <AntDesign name="sync" size={10} color={colors.badgeUnsynced} style={styles.icon} />
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeUnsyncedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.badgeUnsynced,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...typography.small,
    color: colors.badgeUnsynced,
    fontWeight: '600',
  },
});
