import {
  createNativeStackNavigator,
  NativeStackScreenProps }
from "@react-navigation/native-stack";
import SignUpScreen from './SignUpScreen';
import BottomNav from './BottomNav';

type RootStackParamList = {
  SignUpScreen: undefined,
  BottomNav: undefined
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
        name="BottomNav"
        component={BottomNav}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
