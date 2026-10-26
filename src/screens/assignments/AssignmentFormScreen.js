import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { validateAssignmentForm } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình biểu mẫu thêm bài tập mới
export default function AssignmentFormScreen() {
  const navigation = useNavigation();
  const { courses, addAssignment } = useAppData();
  const { isOnline } = useSync();

  // Mặc định ngày hạn nộp là 7 ngày sau thời điểm hiện tại
  const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 1);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Xử lý lưu bài tập mới
  const handleSubmit = async () => {
    // Định dạng chuỗi ngày tháng sang chuẩn ISO 8601
    let isoDueDate = dueDate;
    if (!dueDate.includes('Z')) {
      isoDueDate = new Date(dueDate).toISOString();
    }

    const validation = validateAssignmentForm({
      title,
      dueDate: isoDueDate,
      courseId,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await addAssignment({
        title: title.trim(),
        courseId: Number(courseId),
        dueDate: isoDueDate,
        description: description.trim(),
      });

      if (!isOnline) {
        Alert.alert(
          'Đã lưu ngoại tuyến',
          'Bạn đang offline. Bài tập đã được lưu và sẽ tự động đồng bộ khi có mạng.'
        );
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo bài tập mới');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Thông tin bài tập</Text>

        <FormInput
          label="Tiêu đề bài tập *"
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (errors.title) setErrors(prev => ({ ...prev, title: null }));
          }}
          placeholder="Nhập tên bài tập…"
          error={errors.title}
        />

        {/* Chọn môn học */}
        <Text style={styles.fieldLabel}>Môn học *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
          {courses.map(c => {
            const isSelected = Number(courseId) === Number(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                accessibilityRole="button"
                onPress={() => setCourseId(c.id)}
                style={[styles.courseChip, isSelected && styles.courseChipSelected]}>
                <Text style={[styles.courseText, isSelected && styles.courseTextSelected]}>
                  {c.code} - {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {errors.courseId ? <Text style={styles.errorText}>{errors.courseId}</Text> : null}

        <FormInput
          label="Hạn nộp (YYYY-MM-DDTHH:mm) *"
          value={dueDate}
          onChangeText={text => {
            setDueDate(text);
            if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: null }));
          }}
          placeholder="Ví dụ: 2026-11-05T23:59"
          error={errors.dueDate}
        />

        <FormInput
          label="Mô tả / Yêu cầu"
          value={description}
          onChangeText={setDescription}
          placeholder="Nội dung chi tiết yêu cầu bài tập…"
          multiline={true}
          numberOfLines={4}
        />

        <AppButton
          title="Tạo bài tập"
          variant="primary"
          loading={submitting}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseScroll: {
    marginBottom: spacing.md,
  },
  courseChip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  courseChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courseText: {
    ...typography.caption,
    color: colors.text,
  },
  courseTextSelected: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
