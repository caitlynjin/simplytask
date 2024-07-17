import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TasksScreen from './TasksScreen';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="TasksScreen"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="TasksScreen"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default BottomNav;