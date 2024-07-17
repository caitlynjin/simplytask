import {
  createNativeStackNavigator,
  NativeStackScreenProps }
from "@react-navigation/native-stack";
import SignUpScreen from './SignUpScreen';
import TasksScreen from './TasksScreen';

type RootStackParamList = {
  SignUpScreen: undefined,
  TasksScreen: undefined
};

export type Props = NativeStackScreenProps<RootStackParamList, 'SignUpScreen'>;

export default function RootLayout() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator initialRouteName="SignUpScreen">
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TasksScreen"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
