import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'TODO', label: 'Chưa xong' },
  { value: 'DONE', label: 'Đã xong' },
  { value: 'OVERDUE', label: 'Quá hạn' },
];

// Màn hình danh sách bài tập hỗ trợ bộ lọc và cập nhật lạc quan
export default function AssignmentListScreen() {
  const navigation = useNavigation();
  const {
    assignments,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingAssignmentIds,
    fetchAllData,
    toggleAssignmentStatus,
  } = useAppData();

  const [filter, setFilter] = useState('ALL');

  // Lọc danh sách bài tập theo trạng thái
  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const isDone = item.status === 'done';
      const overdue = !isDone && isOverdue(item.dueDate);

      if (filter === 'TODO') return !isDone;
      if (filter === 'DONE') return isDone;
      if (filter === 'OVERDUE') return overdue;
      return true;
    });
  }, [assignments, filter]);

  if (loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => fetchAllData(false)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.filterWrapper}>
        <FilterChips
          options={FILTER_OPTIONS}
          selected={filter}
          onSelect={setFilter}
        />
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAllData(true)}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={pendingAssignmentIds.has(item.id)}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập"
            description="Không tìm thấy bài tập nào theo bộ lọc đã chọn."
            icon="form"
            actionLabel="Xem tất cả"
            onAction={() => setFilter('ALL')}
          />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <LastUpdatedText timestamp={lastUpdated} />
          </View>
        }
      />

      {/* Nút thêm bài tập mới (FAB) */}
      <TouchableOpacity
        accessibilityLabel="Thêm bài tập mới"
        accessibilityRole="button"
        activeOpacity={0.8}
        onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
        style={styles.fab}>
        <AntDesign name="plus" size={24} color={colors.textWhite} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 80,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
