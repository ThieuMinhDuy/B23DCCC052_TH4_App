import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../theme/colors';

// Nút chuyển đổi trạng thái bài tập (todo <-> done)
export default function StatusToggle({ status, onToggle }) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      accessibilityLabel={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      activeOpacity={0.7}
      onPress={onToggle}
      style={styles.container}>
      <AntDesign
        name={isDone ? 'checkcircle' : 'checkcircleo'}
        size={24}
        color={isDone ? colors.success : colors.textTertiary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
