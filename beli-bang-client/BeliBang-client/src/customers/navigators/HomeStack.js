import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserHomeScreen from '../screens/UserHomeScreen';
import MapScreen from '../screens/MapScreen';
import ListStores from '../screens/ListStores';
import DetailStore from '../screens/DetailStore';
import stylesLib from '../../../assets/styles/styles-lib';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserHomeScreen"
        component={UserHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="MapScreen" 
        component={MapScreen}
        options={{
          title: 'Seller Nearby',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25},
          headerTitleAlign:'center'
        }}
      />
      <Stack.Screen 
        name="ListStores" 
        component={ListStores}
        options={{
          title: 'Store List',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25},
          headerTitleAlign:'center'
        }} 
      />
      <Stack.Screen 
        name="DetailStore" 
        component={DetailStore}
        options={{
          title: 'Store Detail',
          headerTitleAlign:'center',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:25}
        }} 
      />
    </Stack.Navigator>
  );
}
