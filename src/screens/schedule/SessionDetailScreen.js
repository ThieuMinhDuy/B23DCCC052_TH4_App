import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import sessionService from '../../api/sessionService';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import ScreenContainer from '../../components/common/ScreenContainer';
import AppButton from '../../components/common/AppButton';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { getDayLabel } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Màn hình chi tiết buổi học
export default function SessionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const { sessions } = useAppData();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy chi tiết buổi học theo id
  const fetchDetail = async () => {
    setLoading(true);
    const cachedSession = sessions.find(s => s.id === Number(id));
    if (cachedSession) {
      setSession(cachedSession);
      const title = cachedSession.course?.name || 'Chi tiết buổi học';
      navigation.setOptions({ title });
      setLoading(false);
    }

    try {
      const data = await sessionService.getById(id);
      setSession(data);
      const title = data.course?.name || 'Chi tiết buổi học';
      navigation.setOptions({ title });
      setError(null);
    } catch (err) {
      if (!cachedSession) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết buổi học…" />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const course = session?.course;

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <AntDesign name="calendar" size={20} color={colors.primary} style={styles.headerIcon} />
          <Text style={styles.dayText}>{getDayLabel(session?.dayOfWeek)}</Text>
        </View>

        <Text style={styles.courseName}>{course?.name || `Môn học #${session?.courseId}`}</Text>

        <View style={styles.infoRow}>
          <AntDesign name="clockcircleo" size={16} color={colors.textMuted} style={styles.icon} />
          <Text style={styles.label}>Thời gian:</Text>
          <Text style={styles.value}>
            {session?.startTime} - {session?.endTime}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <AntDesign name="enviromento" size={16} color={colors.textMuted} style={styles.icon} />
          <Text style={styles.label}>Phòng học:</Text>
          <Text style={styles.value}>{session?.room}</Text>
        </View>

        {course?.lecturer ? (
          <View style={styles.infoRow}>
            <AntDesign name="user" size={16} color={colors.textMuted} style={styles.icon} />
            <Text style={styles.label}>Giảng viên:</Text>
            <Text style={styles.value}>{course.lecturer}</Text>
          </View>
        ) : null}

        {session?.note ? (
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Ghi chú:</Text>
            <Text style={styles.noteText}>{session.note}</Text>
          </View>
        ) : null}

        {course?.id ? (
          <AppButton
            title="Xem chi tiết môn học"
            variant="outline"
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
            }
            style={styles.actionButton}
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
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerIcon: {
    marginRight: spacing.xs,
  },
  dayText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  courseName: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  icon: {
    marginRight: spacing.sm,
    width: 20,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
    width: 90,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  noteBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 6,
  },
  noteTitle: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: 2,
  },
  noteText: {
    ...typography.body,
    color: colors.textMuted,
  },
  actionButton: {
    marginTop: spacing.lg,
  },
});
