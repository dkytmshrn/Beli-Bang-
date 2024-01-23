import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchTransaction } from '../../../store/actions/actionCreator';
import * as SecureStore from 'expo-secure-store';
import stylesLib from '../../../assets/styles/styles-lib';

export default function HistoryScreen() {
  const [access_token, setAccess_Token] = React.useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        let result = await SecureStore.getItemAsync('access_token');
        setAccess_Token(result);

        dispatch(fetchTransaction(result));
      } catch (error) {
        console.error('Error fetching access token:', error.message);
      }
    };

    fetchAccessToken();
  }, [dispatch]);

  const transactions = [
    { title: 'Title 1', price: 'Rp 40,000', status: 'Completed', imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg' },
    { title: 'Title 2', price: 'Rp 40,000', status: 'Canceled', imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg' },
    { title: 'Title 3', price: 'Rp 40,000', status: 'Completed', imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg' },
  ];

  return (
    <View style={[styles.container, stylesLib.bgColGrLight]}>
      {transactions.map((transaction, index) => (
        <View key={index} style={[styles.cardContainer, stylesLib.bgColCr, transaction.status === 'Canceled' ? styles.cancelledCard : null]}>
           <Image
            source={{ uri: transaction.imageUrl }}
            style={styles.cardImage}
          />
          {transaction.status === 'Canceled' && (
            <View style={styles.overlay}>
              <Text style={[styles.overlayText]}>{transaction.status}</Text>
            </View>
          )}
          <View style={[styles.cardDetails]}>
            <View>
              <Text style={[styles.cardTitle, stylesLib.colGrBold]}>{transaction.title}</Text>
              <Text style={styles.cardPrice}>{transaction.price}</Text>
            </View>
            <View>
              {transaction.status !== 'Canceled'? <Text style={[styles.successStatus]}>{transaction.status}</Text> : <Text style={[styles.cancelStatus]}>{transaction.status}</Text>}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
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
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
  },
  cardPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'green',
  },
  cancelledCard: {
    backgroundColor: '#ccc',
  },
  cancelledImage: {
    tintColor: 'grey',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  overlayText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#DB5856',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  successStatus: {
    padding: 2,
    backgroundColor: '#77DD77',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    borderRadius: 10
  },
  cancelStatus: {
    padding: 2,
    backgroundColor: '#DB5856',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    borderRadius: 10
  }
});
