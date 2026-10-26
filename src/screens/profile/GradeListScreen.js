import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

// Màn hình danh sách điểm theo từng học kỳ
export default function GradeListScreen() {
  const navigation = useNavigation();
  const { grades, courses, loading, refreshing, error, lastUpdated, fetchAllData } = useAppData();

  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Danh sách các học kỳ có trong bảng điểm
  const semesterOptions = useMemo(() => {
    const list = [{ value: 'ALL', label: 'Tất cả học kỳ' }];
    const unique = new Set(grades.map(g => g.semester).filter(Boolean));
    unique.forEach(sem => list.push({ value: sem, label: sem }));
    return list;
  }, [grades]);

  // Lọc điểm theo học kỳ
  const filteredGrades = useMemo(() => {
    if (selectedSemester === 'ALL') return grades;
    return grades.filter(g => g.semester === selectedSemester);
  }, [grades, selectedSemester]);

  // Tính GPA và số tín chỉ theo bộ lọc học kỳ hiện tại
  const { gpa, totalCredits } = useMemo(() => {
    return calcGpa(filteredGrades, courses);
  }, [filteredGrades, courses]);

  if (loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải kết quả học tập…" />
      </ScreenContainer>
    );
  }

  if (error && grades.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => fetchAllData(false)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.filterSection}>
        <FilterChips
          options={semesterOptions}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
        />
      </View>

      <FlatList
        data={filteredGrades}
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
        ListHeaderComponent={
          <GpaSummary gpa={gpa} totalCredits={totalCredits} />
        }
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có kết quả học tập"
            description="Chưa có điểm cho học kỳ đã chọn."
            icon="barschart"
            actionLabel="Xem tất cả"
            onAction={() => setSelectedSemester('ALL')}
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
  filterSection: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    padding: spacing.md,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
