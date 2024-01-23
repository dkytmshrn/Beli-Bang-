import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderCustScreen from '../screens/OrderCustScreen';
import MapScreenTransc from '../screens/MapScreenTransc';
import stylesLib from '../../../assets/styles/styles-lib';

const Stack = createNativeStackNavigator();

export default function OrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderCustScreen"
        component={OrderCustScreen}
        options={{
          title: 'Orders',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25},
          headerTitleAlign:'center'
        }}
      />
      <Stack.Screen
        name="MapScreenTransc"
        component={MapScreenTransc}
        options={{
          title: 'Seller Location',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25},
          headerTitleAlign:'center'
        }}
      />
    </Stack.Navigator>
  );
}
