import {
  createNativeStackNavigator,
  NativeStackScreenProps }
from "@react-navigation/native-stack";
import SignUpScreen from './SignUpScreen';
import BottomNav from './BottomNav';

export type RootStackParamList = {
  SignUpScreen: undefined,
  BottomNav: undefined,
  Profile: undefined,
  Tasks: undefined,
  Leaderboard: undefined
};

export type SignUpScreenProp = NativeStackScreenProps<RootStackParamList, 'SignUpScreen'>;
export type BottomNavProp = NativeStackScreenProps<RootStackParamList, 'BottomNav'>;
export type ProfileProp = NativeStackScreenProps<RootStackParamList, 'Profile'>;
export type TasksProp = NativeStackScreenProps<RootStackParamList, 'Tasks'>;
export type LeaderboardProp = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;

export default function RootLayout() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator initialRouteName="SignUpScreen">
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="BottomNav"
        component={BottomNav}
        options={{ headerShown: false, animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
