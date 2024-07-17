import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TasksScreen from './TasksScreen';
import LeaderboardScreen from './LeaderboardScreen';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
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
    </Tab.Navigator>
  );
}

export default BottomNav;