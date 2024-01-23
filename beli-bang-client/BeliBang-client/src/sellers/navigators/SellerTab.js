import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons, Feather } from '@expo/vector-icons';
import stylesLib from '../../../assets/styles/styles-lib';
import ProfileScreen from '../screens/ProfileScreen';
import SellerHomeStack from './SellerHomeStack';
import OrderStack from './OrderStack';

const Tab = createBottomTabNavigator();

export default function SellerTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 70,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: stylesLib.bgColSec.backgroundColor,
          position: 'absolute',
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={SellerHomeStack}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size, focused }) => <Ionicons name="home" size={24} color={focused ? stylesLib.colTer.color : stylesLib.colPri.color } />,
        }}
      />
      <Tab.Screen
        name="Order Seller"
        component={OrderStack}
        options={{
          tabBarLabel: () => null,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <Feather name="list" size={24} color={focused ? stylesLib.colTer.color : stylesLib.colPri.color } />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => null,
          title: 'My Profile',
            headerTitleAlign: 'left',
            headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25},
          tabBarIcon: ({ color, size, focused }) => <Ionicons name="person-circle-outline" size={24} color={focused ? stylesLib.colTer.color : stylesLib.colPri.color } />,
        }}
      />
    </Tab.Navigator>
  );
}
