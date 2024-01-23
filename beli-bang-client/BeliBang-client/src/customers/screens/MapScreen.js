import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, showStores, updateLocationUser } from '../../../store/actions/actionCreator';
import * as SecureStore from 'expo-secure-store';
import stylesLib from '../../../assets/styles/styles-lib';

export default function MapScreen() {
  const [getLocation, setLocation] = useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const openStore = useSelector((state) => {
    return state.openStore;
  });
  const user = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return navigation.navigate('UserHomeScreen');
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        let userId = await SecureStore.getItemAsync('userId');
        let access_token = await SecureStore.getItemAsync('access_token');
        const stores = await dispatch(showStores(access_token));
        const setLocationUser = await dispatch(updateLocationUser(currentLocation, access_token));
        const detailUser = await dispatch(fetchUser(userId, access_token));
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return navigation.navigate('UserHomeScreen');
          }
          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          let userId = await SecureStore.getItemAsync('userId');
          let access_token = await SecureStore.getItemAsync('access_token');
          const stores = await dispatch(showStores(access_token));
          const setLocationUser = await dispatch(updateLocationUser(currentLocation, access_token));
          const detailUser = await dispatch(fetchUser(userId, access_token));
        } catch (err) {
          console.log(err);
        }
      })();
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <View style={styles.container}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: user.location.coordinates[1],
                longitude: user.location.coordinates[0],
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0021,
              }}
            >
              <Marker
                coordinate={{
                  latitude: user.location.coordinates[1],
                  longitude: user.location.coordinates[0],
                }}
                title={user.username}
                description="Your position"
                pinColor={stylesLib.colRed.color}
              />
              {openStore.map((e) => {
                return (
                  <Marker
                    coordinate={{
                      latitude: e.User.location.coordinates[1],
                      longitude: e.User.location.coordinates[0],
                    }}
                    title={e.name}
                    description="Seller"
                    key={e.id}
                    pinColor={stylesLib.bgColCr.backgroundColor}
                  />
                );
              })}
            </MapView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
