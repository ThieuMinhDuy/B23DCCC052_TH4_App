import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { getTodayDayOfWeek, getDayLabel } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

// Màn hình thời khóa biểu lọc theo thứ trong tuần
export default function ScheduleScreen() {
  const navigation = useNavigation();
  const { sessions, loading, refreshing, error, lastUpdated, fetchAllData } = useAppData();

  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek());

  // Lọc các buổi học theo ngày đã chọn và sắp xếp theo giờ bắt đầu
  const daySessions = useMemo(() => {
    return sessions
      .filter(s => Number(s.dayOfWeek) === Number(selectedDay))
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [sessions, selectedDay]);

  if (loading && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thời khóa biểu…" />
      </ScreenContainer>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => fetchAllData(false)} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.selectorWrapper}>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </View>

      <FlatList
        data={daySessions}
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
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title={`Không có lịch học ${getDayLabel(selectedDay)}`}
            description="Bạn không có buổi học nào vào ngày này. Hãy tận dụng thời gian rảnh để làm bài tập nhé!"
            icon="calendar"
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
  selectorWrapper: {
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
