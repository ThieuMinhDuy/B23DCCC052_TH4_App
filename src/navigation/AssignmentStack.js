import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';
import colors from '../theme/colors';

const Stack = createStackNavigator();

// Stack điều hướng cho Tab Bài tập
export default function AssignmentStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.ASSIGNMENT_LIST}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textWhite,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_LIST}
        component={AssignmentListScreen}
        options={{ title: 'Bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_FORM}
        component={AssignmentFormScreen}
        options={{ title: 'Thêm bài tập mới' }}
      />
    </Stack.Navigator>
  );
}
