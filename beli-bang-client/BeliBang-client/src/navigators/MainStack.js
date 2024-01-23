import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import CustomerTab from '../customers/navigators/CustomerTab';
import SellerTab from '../sellers/navigators/SellerTab';
import RegisterStore from '../sellers/screens/RegisterStore';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterStore"
        component={RegisterStore}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CustomerTab"
        component={CustomerTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SellerTab"
        component={SellerTab}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
