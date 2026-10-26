import React from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import CourseCard from '../../components/course/CourseCard';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { isDueInNextDays } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình Trang chủ tổng quan thông tin học tập
export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    student,
    courses,
    assignments,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingAssignmentIds,
    fetchAllData,
    toggleAssignmentStatus,
  } = useAppData();

  const { pendingCount, syncNow, syncing } = useSync();

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải dữ liệu tổng quan…" />
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

  // Lọc bài tập đến hạn trong 7 ngày tới
  const upcomingAssignments = Array.isArray(assignments)
    ? assignments.filter(a => a.status !== 'done' && isDueInNextDays(a.dueDate, 7))
    : [];

  return (
    <ScreenContainer scroll={false}>
      <FlatList
        data={upcomingAssignments}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAllData(true)}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Thẻ sinh viên */}
            <View style={styles.studentCard}>
              <View style={styles.avatar}>
                <AntDesign name="user" size={24} color={colors.primary} />
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student?.fullName || 'Sinh viên'}</Text>
                <Text style={styles.studentSub}>
                  {student?.studentCode} • {student?.className}
                </Text>
                <Text style={styles.studentMajor}>{student?.major}</Text>
              </View>
            </View>

            {/* Các thẻ chỉ số tóm tắt */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{courses.length}</Text>
                <Text style={styles.statLabel}>Môn học</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.warning }]}>
                  {upcomingAssignments.length}
                </Text>
                <Text style={styles.statLabel}>Hạn 7 ngày tới</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={syncNow}
                disabled={syncing || pendingCount === 0}
                style={[styles.statBox, pendingCount > 0 && styles.statBoxPending]}>
                <Text
                  style={[
                    styles.statValue,
                    { color: pendingCount > 0 ? colors.badgeUnsynced : colors.success },
                  ]}>
                  {pendingCount}
                </Text>
                <Text style={styles.statLabel}>
                  {syncing ? 'Đang đồng bộ…' : 'Chưa đồng bộ'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tiêu đề danh sách bài tập đến hạn */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bài tập đến hạn trong 7 ngày tới</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={pendingAssignmentIds.has(item.id)}
            onPress={() =>
              navigation.navigate(ROUTES.HOME_ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập đến hạn"
            description="Bạn không có bài tập nào cần nộp trong 7 ngày tới."
            icon="checkcircleo"
          />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <LastUpdatedText timestamp={lastUpdated} />
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
  },
  studentCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.h3,
    color: colors.text,
  },
  studentSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  studentMajor: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBoxPending: {
    borderColor: colors.badgeUnsynced,
    backgroundColor: colors.badgeUnsyncedBg,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
