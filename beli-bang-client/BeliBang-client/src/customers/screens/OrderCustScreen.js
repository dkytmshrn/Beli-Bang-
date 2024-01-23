import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import stylesLib from '../../../assets/styles/styles-lib';
import { fetchCustomerOrder, updateStatusOrder } from '../../../store/actions/actionCreator';

export default function OrderSellerScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = React.useState(null);
  const customerOrder = useSelector((state) => state.customerOrder);
  const [isLoading, setIsLoading] = useState(true);
  const [buyerLatitude, setBuyerLatitude] = useState('');
  const [buyerLongitude, setBuyerLongitude] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let access_token = await SecureStore.getItemAsync('access_token');
        setAccessToken(access_token);
        const result = await dispatch(fetchCustomerOrder(access_token));
        setBuyerLatitude(result[0].User.location.coordinates[1]);
        setBuyerLongitude(result[0].User.location.coordinates[0]);
        setIsLoading(false);
      } catch (err) {
        console.log(err, '<<<<< ini err');
        setErrorMessage(err);
        setIsLoading(false);
      }
    })();
  }, []);

  function handleReceive(orderId) {
    try {
      const status = { status: 'Completed' };
      dispatch(updateStatusOrder(orderId, status, accessToken, 'Customer'));
      console.log('UPDATE STATUS SUCCESS!');
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel(orderId) {
    try {
      const status = {
        status: 'Canceled',
      };
      dispatch(updateStatusOrder(orderId, status, accessToken, 'Customer'));
      console.log('UPDATE STATUS SUCCESS');
    } catch (err) {
      console.log(err);
    }
  }

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    return Math.floor(distance);
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  return (
    <View style={[stylesLib.bgColPri, stylesLib.flex1,{paddingBottom:70}]}>
      {isLoading ? (
        <View style={[stylesLib.pad10, stylesLib.center, { height: '100%', justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View>
          {errorMessage !== '' ? (
            <View style={[stylesLib.pad10, {height:'100%' ,justifyContent:'center'}]}>
              <View style={[{alignItems:'center', alignContent:'center'}]}>
                <Text style={[stylesLib.colSec, {fontSize:30, fontWeight:'600'}]}>{errorMessage}</Text>
              </View>
            </View>
          ) : (
            <ScrollView style={[stylesLib.pad10]}>
              <View contentContainerStyle={[styles.container, stylesLib.bgColPri]}>
                {customerOrder.map((order) => (
                  <React.Fragment key={order.id}>
                    {(order.status === 'Waiting' || order.status === 'Canceled' || order.status === 'Processing' || order.status === 'Completed') && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('MapScreenTransc', {
                            id: order.id,
                          })
                        }
                      >
                        <View style={[styles.cardContainer, stylesLib.bgColPri]}>
                          <Image source={{ uri: order.Store.imageUrl }} style={styles.cardImage} />
                          {order.status === 'Canceled' && (
                            <View style={styles.overlay}>
                              <Text style={[styles.overlayTextCancelled]}>{order.status}</Text>
                            </View>
                          )}
                          <View style={styles.cardDetails}>
                            <View>
                              <Text style={styles.cardTitle}>{order.Store.name}</Text>
                              <Text>{haversineDistance(buyerLatitude, buyerLongitude, order.Store.User.location.coordinates[1], order.Store.User.location.coordinates[0])} meters</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                              {order.status === 'Processing' && (
                                <>
                                  <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleReceive(order.id)}>
                                    <Text style={[stylesLib.colPri, {fontWeight:'600'}]}>Receive</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleCancel(order.id)}>
                                    <Text style={[stylesLib.colSec, {fontWeight:'600'}]}>Cancel</Text>
                                  </TouchableOpacity>
                                </>
                              )}
                              {order.status === 'Waiting' && <Text style={[styles.waitingStatus]}>Waiting</Text>}
                              {order.status === 'Completed' && <Text style={[styles.successStatus]}>Completed</Text>}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    borderWidth: 5,
    borderColor: stylesLib.colSec.color,
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  cardDetails: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: stylesLib.colSec.color,
  },
  cardDescription: {
    fontSize: 16,
    color: stylesLib.colSec.color,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: stylesLib.bgColSec.backgroundColor,
  },
  rejectButton: {
    backgroundColor: stylesLib.bgColPri.backgroundColor,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayTextCancelled: {
    fontSize: 30,
    fontWeight: 'bold',
    color: stylesLib.colPri.color,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlayTextSuccess: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#77DD77',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  successStatus: {
    padding: 4,
    backgroundColor: stylesLib.bgColTer.backgroundColor,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    borderRadius: 10,
    color: stylesLib.colPri.color
  },
  waitingStatus: {
    padding: 4,
    backgroundColor: stylesLib.bgColSec.backgroundColor,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    borderRadius: 10,
    color: stylesLib.colPri.color
  },
});

// import React, { useEffect } from 'react';
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { fetchTransaction } from '../../../store/actions/actionCreator';
// import * as SecureStore from 'expo-secure-store';
// import { useNavigation } from '@react-navigation/native';
// import stylesLib from '../../../assets/styles/styles-lib';

// export default function OrderSellerScreen() {
//   const [access_token, setAccess_Token] = React.useState(null);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchAccessToken = async () => {
//       try {
//         let result = await SecureStore.getItemAsync('access_token');
//         setAccess_Token(result);

//         dispatch(fetchTransaction(result));
//       } catch (error) {
//         console.error('Error fetching access token:', error.message);
//       }
//     };

//     fetchAccessToken();
//   }, [dispatch]);

//   const transactions = [
//     { id: 1, title: 'Title 1', price: 'Rp 40,000', status: 'Processing', imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg' },
//     { id: 2, title: 'Title 2', price: 'Rp 40,000', status: 'Processing', imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg' },
//     { id: 3, title: 'Title 3', price: 'Rp 40,000', status: 'Processing', imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg' },
//   ];

//   return (
//     <ScrollView contentContainerStyle={[styles.container, stylesLib.bgColGrLight]}>
//       {transactions.map((transaction, index) => (
//         <TouchableOpacity onPress={() => navigation.navigate('MapScreenTransc')}>
//           <View key={transaction.id} style={[styles.cardContainer, stylesLib.bgColCr]}>
//             <Image source={{ uri: transaction.imageUrl }} style={styles.cardImage} />
//             <View style={styles.cardDetails}>
//               <View>
//                 <Text style={[styles.cardTitle, stylesLib.colGrBold]}>{transaction.title}</Text>
//                 <Text style={styles.cardPrice}>{transaction.price}</Text>
//               </View>
//               <View>
//                 <Text style={[styles.cardDescription, stylesLib.colGrLight, {fontWeight:'700', textDecorationLine:'underline'}]}>{transaction.status}...</Text>
//               </View>
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     flex: 1
//   },
//   cardContainer: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     marginVertical: 10,
//     overflow: 'hidden',
//   },
//   cardImage: {
//     width: 150,
//     height: 150,
//     resizeMode: 'cover',
//   },
//   cardDetails: {
//     flex: 1,
//     padding: 10,
//     flexDirection: 'column',
//     justifyContent: 'space-between'
//   },
//   cardTitle: {
//     fontSize: 23,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cardDescription: {
//     fontSize: 16,
//     color: '#666',
//   },
//   cardPrice: {
//     fontSize: 19,
//     fontWeight: 'bold',
//     marginTop: 5,
//     color: 'green',
//   },
// });
