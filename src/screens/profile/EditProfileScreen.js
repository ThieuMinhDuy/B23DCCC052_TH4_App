import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { validateProfileForm } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình chỉnh sửa thông tin cá nhân sinh viên
export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { student, updateStudentProfile } = useAppData();
  const { isOnline } = useSync();

  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Xử lý cập nhật thông tin cá nhân
  const handleSubmit = async () => {
    const validation = validateProfileForm({
      fullName,
      email,
      phone,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await updateStudentProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (!isOnline) {
        Alert.alert(
          'Đã lưu ngoại tuyến',
          'Bạn đang offline. Thông tin chỉnh sửa đã được lưu vào hàng đợi và sẽ tự động đồng bộ khi có mạng.'
        );
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật thông tin sinh viên');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Chỉnh sửa thông tin sinh viên</Text>

        <FormInput
          label="Mã sinh viên"
          value={student?.studentCode}
          editable={false}
        />

        <FormInput
          label="Lớp"
          value={student?.className}
          editable={false}
        />

        <FormInput
          label="Họ và tên *"
          value={fullName}
          onChangeText={text => {
            setFullName(text);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
          }}
          placeholder="Nhập họ và tên…"
          error={errors.fullName}
        />

        <FormInput
          label="Email *"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) setErrors(prev => ({ ...prev, email: null }));
          }}
          placeholder="Nhập địa chỉ email…"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          label="Số điện thoại *"
          value={phone}
          onChangeText={text => {
            setPhone(text);
            if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
          }}
          placeholder="Nhập số điện thoại…"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <AppButton
          title="Lưu thông tin"
          variant="primary"
          loading={submitting}
          onPress={handleSubmit}
          style={styles.saveButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
