import React, { useMemo } from 'react';
import { View, Text, RefreshControl, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình thông tin cá nhân và tóm tắt học tập của sinh viên
export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    student,
    grades,
    courses,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingProfileUpdate,
    fetchAllData,
  } = useAppData();

  // Tính GPA tích lũy hệ 4 và tổng tín chỉ
  const { gpa, totalCredits } = useMemo(() => {
    return calcGpa(grades, courses);
  }, [grades, courses]);

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin cá nhân…" />
      </ScreenContainer>
    );
  }

  if (error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => fetchAllData(false)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAllData(true)}
            colors={[colors.primary]}
          />
        }>
        {/* Header sinh viên */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <AntDesign name="user" size={32} color={colors.primary} />
          </View>
          <Text style={styles.name}>{student?.fullName}</Text>
          <Text style={styles.code}>{student?.studentCode}</Text>
          {pendingProfileUpdate ? (
            <View style={styles.badgeWrapper}>
              <SyncBadge pending={true} />
            </View>
          ) : null}
        </View>

        {/* Tóm tắt GPA */}
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />

        {/* Thông tin chi tiết */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Thông tin tài khoản</Text>
          <InfoRow label="Lớp" value={student?.className} icon="team" />
          <InfoRow label="Chuyên ngành" value={student?.major} icon="solution1" />
          <InfoRow label="Email" value={student?.email} icon="mail" />
          <InfoRow label="Số điện thoại" value={student?.phone} icon="phone" />
        </View>

        {/* Các nút hành động */}
        <View style={styles.buttonGroup}>
          <AppButton
            title="Chỉnh sửa thông tin"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            style={styles.actionBtn}
          />
          <AppButton
            title="Xem kết quả học tập"
            variant="primary"
            onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
            style={styles.actionBtn}
          />
        </View>

        <LastUpdatedText timestamp={lastUpdated} style={styles.footerTime} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.md,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.h3,
    color: colors.text,
  },
  code: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  badgeWrapper: {
    marginTop: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  buttonGroup: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionBtn: {
    width: '100%',
  },
  footerTime: {
    paddingVertical: spacing.sm,
  },
});
