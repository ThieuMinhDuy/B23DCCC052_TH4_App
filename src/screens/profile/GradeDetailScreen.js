import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import gradeService from '../../api/gradeService';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình chi tiết kết quả học tập của một môn
export default function GradeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const { grades } = useAppData();
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy chi tiết điểm theo id
  const fetchDetail = async () => {
    setLoading(true);
    const cachedItem = grades.find(g => g.id === Number(id));
    if (cachedItem) {
      setGrade(cachedItem);
      const title = cachedItem.course?.name || 'Chi tiết kết quả học tập';
      navigation.setOptions({ title });
      setLoading(false);
    }

    try {
      const data = await gradeService.getById(id);
      setGrade(data);
      const title = data.course?.name || 'Chi tiết kết quả học tập';
      navigation.setOptions({ title });
      setError(null);
    } catch (err) {
      if (!cachedItem) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết điểm môn học…" />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const course = grade?.course;
  const totalScore10 = Number(grade?.total !== undefined ? grade.total : grade?.totalScore10 || 0);
  const scale4 = toScale4(totalScore10);
  const letter = grade?.letter || grade?.letterGrade || '-';

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{course?.code || 'MÃ MÔN'}</Text>
          </View>
          <Text style={styles.semesterText}>{grade?.semester}</Text>
        </View>

        <Text style={styles.courseName}>{course?.name || `Môn học #${grade?.courseId}`}</Text>
        <Text style={styles.creditsText}>{course?.credits || grade?.credits || 3} tín chỉ</Text>

        {/* Điểm tổng kết nổi bật */}
        <View style={styles.totalBox}>
          <View style={styles.totalCol}>
            <Text style={styles.totalNumber}>{totalScore10.toFixed(2)}</Text>
            <Text style={styles.totalSub}>Hệ 10</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalCol}>
            <Text style={styles.totalNumber}>{scale4.toFixed(2)}</Text>
            <Text style={styles.totalSub}>Hệ 4</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalCol}>
            <Text style={[styles.totalNumber, { color: colors.primary }]}>{letter}</Text>
            <Text style={styles.totalSub}>Điểm chữ</Text>
          </View>
        </View>

        {/* Chi tiết từng thành phần điểm */}
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Điểm thành phần</Text>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Chuyên cần (10%)</Text>
            <Text style={styles.scoreVal}>{grade?.attendance ?? '-'}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Giữa kỳ (30%)</Text>
            <Text style={styles.scoreVal}>{grade?.midterm ?? '-'}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Cuối kỳ (60%)</Text>
            <Text style={styles.scoreVal}>{grade?.final ?? '-'}</Text>
          </View>
        </View>

        {course?.id ? (
          <AppButton
            title="Xem chi tiết môn học"
            variant="outline"
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
            }
            style={styles.actionBtn}
          />
        ) : null}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primarySurface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  semesterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  courseName: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  totalBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  totalCol: {
    alignItems: 'center',
  },
  totalNumber: {
    ...typography.h2,
    color: colors.text,
  },
  totalSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  detailSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  detailTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scoreLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  scoreVal: {
    ...typography.bodyBold,
    color: colors.text,
  },
  actionBtn: {
    marginTop: spacing.lg,
  },
});
