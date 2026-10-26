import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import colors from '../theme/colors';

const Stack = createStackNavigator();

// Stack điều hướng cho Tab Thời khóa biểu
export default function ScheduleStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SCHEDULE_SCREEN}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textWhite,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={ROUTES.SCHEDULE_SCREEN}
        component={ScheduleScreen}
        options={{ title: 'Thời khóa biểu' }}
      />
      <Stack.Screen
        name={ROUTES.SESSION_DETAIL}
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
    </Stack.Navigator>
  );
}
