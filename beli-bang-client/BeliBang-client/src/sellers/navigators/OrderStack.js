import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderSellerScreen from '../screens/OrderSellerScreen';
import SellerMapScreen from '../screens/SellerMapScreen';
import stylesLib from '../../../assets/styles/styles-lib';

const Stack = createNativeStackNavigator();

export default function OrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderSellerScreen"
        component={OrderSellerScreen}
        options={{
          title: 'Orders',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25}
        }}
      />
      <Stack.Screen
        name="SellerMapScreen"
        component={SellerMapScreen}
        options={{
          title: 'My Customer',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25}
        }}
      />
    </Stack.Navigator>
  );
}
