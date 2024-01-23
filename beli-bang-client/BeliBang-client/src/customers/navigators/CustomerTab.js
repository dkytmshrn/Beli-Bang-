import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import UserHomeScreen from '../screens/UserHomeScreen';
import LikeScreen from '../screens/LikeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
// import OrderCustScreen from '../screens/OrderCustScreen';
import { Ionicons, Entypo, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import stylesLib from '../../../assets/styles/styles-lib';
import HomeStack from './HomeStack';
import OrderStack from './OrderStack';

const Tab = createBottomTabNavigator();

export default function CustomerTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 70,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: stylesLib.bgColCr.backgroundColor,
          position: 'absolute',
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: () => null,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <Ionicons name="home" size={24} color={focused ? stylesLib.colTer.color : stylesLib.colPri.color} />,
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderStack}
        options={{
          tabBarLabel: () => null,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <Feather name="list" size={24} color={focused ? stylesLib.colTer.color : stylesLib.colPri.color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => null,
          title: 'My Profile',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25},
          tabBarIcon: ({ color, size, focused }) => <Ionicons name="person-circle-outline" size={24} color={focused ? stylesLib.colTer.color : stylesLib.colPri.color} />,
        }}
      />
    </Tab.Navigator>
  );
}
