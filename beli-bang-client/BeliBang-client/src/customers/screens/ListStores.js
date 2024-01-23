import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ListStoresCard from '../components/ListStoresCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStore, fetchUser, showStores, updateLocationUser } from '../../../store/actions/actionCreator';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import stylesLib from '../../../assets/styles/styles-lib';

export default function ListStores() {
  const [getLocation, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
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

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (getLocation) {
    text = JSON.stringify(getLocation);
  }
  console.log(text, '<<<<<< ini text');

  return (
    <ScrollView>
      <View>
        {isLoading ? (
          <View style={[stylesLib.pad10, stylesLib.center, { height: '100%', justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={[{paddingBottom: 80}, stylesLib.bgColPri]}>
            {openStore.map((e) => {
              return (
                <ListStoresCard
                  title={e.name}
                  imageSource={e.imageUrl}
                  rating="4"
                  sellerLatitude={e.User.location.coordinates[1]}
                  sellerLongitude={e.User.location.coordinates[0]}
                  userLatitude={user.location.coordinates[1]}
                  userLongitude={user.location.coordinates[0]}
                  key={e.id}
                  storeId={e.id}
                />
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
