import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import CourseCard from '../../components/course/CourseCard';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

// Màn hình danh sách môn học có tìm kiếm và lọc học kỳ
export default function CourseListScreen() {
  const navigation = useNavigation();
  const { courses, loading, refreshing, error, lastUpdated, fetchAllData } = useAppData();

  const [searchText, setSearchText] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Danh sách các học kỳ có trong dữ liệu
  const semesterOptions = useMemo(() => {
    const list = [{ value: 'ALL', label: 'Tất cả học kỳ' }];
    const unique = new Set(courses.map(c => c.semester).filter(Boolean));
    unique.forEach(sem => list.push({ value: sem, label: sem }));
    return list;
  }, [courses]);

  // Lọc theo từ khóa tìm kiếm và học kỳ
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchSearch =
        !searchText.trim() ||
        course.name.toLowerCase().includes(searchText.toLowerCase()) ||
        course.code.toLowerCase().includes(searchText.toLowerCase());

      const matchSemester =
        selectedSemester === 'ALL' || course.semester === selectedSemester;

      return matchSearch && matchSemester;
    });
  }, [courses, searchText, selectedSemester]);

  if (loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học…" />
      </ScreenContainer>
    );
  }

  if (error && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => fetchAllData(false)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.filterSection}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm theo tên hoặc mã môn học…"
        />
        <FilterChips
          options={semesterOptions}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
        />
      </View>

      <FlatList
        data={filteredCourses}
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
          <CourseCard
            course={item}
            onPress={() => navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description="Không có môn học nào khớp với điều kiện tìm kiếm hoặc bộ lọc."
            icon="search1"
            actionLabel="Xóa bộ lọc"
            onAction={() => {
              setSearchText('');
              setSelectedSemester('ALL');
            }}
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
    padding: spacing.md,
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
