import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatLastUpdated } from '../../utils/date';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

// Hiển thị thời điểm cập nhật dữ liệu gần nhất
export default function LastUpdatedText({ timestamp, style }) {
  if (!timestamp) {
    return null;
  }

  const formatted = formatLastUpdated(timestamp);
  if (!formatted) {
    return null;
  }

  return (
    <Text style={[styles.text, style]}>
      Cập nhật lần cuối: {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
