import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SellerHomeScreen from '../screens/SellerHomeScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import EditFoodScreen from '../screens/EditFoodScreen';
import stylesLib from '../../../assets/styles/styles-lib';
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SellerHomeScreen"
        component={SellerHomeScreen}
        options={{
          title: 'BELI BANG!',
          headerTitleAlign: 'center',
          headerTitleStyle: {color: stylesLib.colSec.color, fontWeight:'800', fontSize:30}
        }}
      />
      <Stack.Screen
        name="AddFoodScreen"
        component={AddFoodScreen}
        options={{
          title: ''
        }}
      />
      <Stack.Screen
        name="EditFoodScreen"
        component={EditFoodScreen}
        options={{
          title: ''
        }}
      />
    </Stack.Navigator>
  );
}
