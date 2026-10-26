import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ROUTES } from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

// Component hiển thị biểu tượng AntDesign cho từng tab
function RenderTabIcon({ name, color, size = 22 }) {
  return <AntDesign name={name} size={size} color={color} />;
}

// Bộ điều hướng Bottom Tab 5 tab chính của ứng dụng sử dụng icon AntDesign
export default function AppNavigator() {
  const { assignments } = useAppData();

  const unfinishedCount = Array.isArray(assignments)
    ? assignments.filter(a => a.status !== 'done').length
    : 0;

  return (
    <NavigationContainer theme={NavTheme}>
      <Tab.Navigator
        initialRouteName={ROUTES.TAB_HOME}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}>
        <Tab.Screen
          name={ROUTES.TAB_HOME}
          component={HomeStack}
          options={{
            tabBarLabel: 'Tổng quan',
            tabBarIcon: ({ color }) => <RenderTabIcon name="home" color={color} size={22} />,
          }}
        />
        <Tab.Screen
          name={ROUTES.TAB_COURSES}
          component={CourseStack}
          options={{
            tabBarLabel: 'Môn học',
            tabBarIcon: ({ color }) => <RenderTabIcon name="book" color={color} size={22} />,
          }}
        />
        <Tab.Screen
          name={ROUTES.TAB_SCHEDULE}
          component={ScheduleStack}
          options={{
            tabBarLabel: 'Lịch học',
            tabBarIcon: ({ color }) => <RenderTabIcon name="calendar" color={color} size={22} />,
          }}
        />
        <Tab.Screen
          name={ROUTES.TAB_ASSIGNMENTS}
          component={AssignmentStack}
          options={{
            tabBarLabel: 'Bài tập',
            tabBarBadge: unfinishedCount > 0 ? unfinishedCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: colors.error,
              color: colors.textWhite,
              fontSize: 11,
              fontWeight: '700',
            },
            tabBarIcon: ({ color }) => <RenderTabIcon name="form" color={color} size={22} />,
          }}
        />
        <Tab.Screen
          name={ROUTES.TAB_PROFILE}
          component={ProfileStack}
          options={{
            tabBarLabel: 'Cá nhân',
            tabBarIcon: ({ color }) => <RenderTabIcon name="user" color={color} size={22} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
