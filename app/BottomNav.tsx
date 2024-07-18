import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TasksScreen from './TasksScreen';
import LeaderboardScreen from './LeaderboardScreen';
import ProfileScreen from './ProfileScreen';
import { BottomNavProp, RootStackParamList } from './_layout';

const BottomNav = ({ navigation }: BottomNavProp) => {
  const Tab = createBottomTabNavigator<RootStackParamList>();

  return (
    <Tab.Navigator
      initialRouteName="Tasks"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default BottomNav;

function createNativeStackNavigator<T>() {
  throw new Error('Function not implemented.');
}
