import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import stylesLib from '../../../assets/styles/styles-lib';
import iconBB from '../../../assets/belibang-CB.png';
import * as Location from 'expo-location';
import { updateLocationUser } from '../../../store/actions/actionCreator';
import { useDispatch } from 'react-redux';

export default function UserHomeScreen({ navigation }) {
  const [getLocation, setLocation] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        let access_token = await SecureStore.getItemAsync('access_token');
        setAccessToken(access_token);
        const setLocationUser = await dispatch(updateLocationUser(currentLocation, access_token));
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <View style={[stylesLib.flex1, stylesLib.bgColGrLight, stylesLib.pad20]}>
      <View style={[{ paddingTop: 60, paddingBottom: 50 }]}>
        <Image source={iconBB} style={[stylesLib.logo]} />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('MapScreen')}
        style={[
          stylesLib.bgColSec,
          {
            marginBottom: 30,
            padding: 30,
            height: 150,
            justifyContent: 'center',
            borderRadius: 30,
            borderWidth: 5,
            borderColor: stylesLib.colTer.color,
          },
        ]}
      >
        <Text style={[{ fontSize: 30, textAlign: 'center', fontWeight: '900' }, stylesLib.colPri]}>SELLERS NEAR ME</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ListStores')}
        style={[
          stylesLib.bgColSec,
          {
            marginBottom: 20,
            padding: 30,
            height: 150,
            justifyContent: 'center',
            borderRadius: 30,
            borderWidth: 5,
            borderColor: stylesLib.colTer.color,
          },
        ]}
      >
        <Text style={[{ fontSize: 30, textAlign: 'center', fontWeight: '900' }, stylesLib.colPri]}>EXPLORE STREET SELLERS</Text>
      </TouchableOpacity>
    </View>
  );
}
