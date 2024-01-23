import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { fetchTransaction } from '../../../store/actions/actionCreator';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import stylesLib from '../../../assets/styles/styles-lib';

export default function LikeScreen() {
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

  const likedTransactions = [
    {
      title: 'Title 1',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, eius. Beatae quam vero, facilis ducimus laborum alias? Ducimus, non unde.',
      imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg',
    },
    {
      title: 'Title 2',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, eius. Beatae quam vero, facilis ducimus laborum alias? Ducimus, non unde.',
      imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg',
    },
    {
      title: 'Title 3',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, eius. Beatae quam vero, facilis ducimus laborum alias? Ducimus, non unde.',
      imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg',
    },
    {
      title: 'Title 4',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, eius. Beatae quam vero, facilis ducimus laborum alias? Ducimus, non unde.',
      imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg',
    },
    {
      title: 'Title 5',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, eius. Beatae quam vero, facilis ducimus laborum alias? Ducimus, non unde.',
      imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg',
    },
    {
      title: 'Title 6',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis, eius. Beatae quam vero, facilis ducimus laborum alias? Ducimus, non unde.',
      imageUrl: 'https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg',
    },
  ];

  return (
    <ScrollView style={[stylesLib.flex1, stylesLib.bgColGrLight, stylesLib.pad10]}>
      <View style={{ paddingBottom: 80 }}>
        {likedTransactions.map((transaction, index) => (
          <Card key={index} style={[styles.cardContainer, stylesLib.bgColCr]}>
            <Card.Cover source={{ uri: transaction.imageUrl }} style={[styles.cardImage, stylesLib.bgColCr]} />
            <View style={styles.iconContainer}>
              <MaterialIcons name="favorite" size={24} color="red" style={styles.iconHeart} />
            </View>
            <Card.Content style={styles.cardContent}>
              <Title style={[styles.cardTitle, stylesLib.colGrBold]}>{transaction.title}</Title>
              <Paragraph style={styles.cardDescription}>{transaction.description}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    marginVertical: 10,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    padding:5
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 15,
    marginTop: 5,
    color: 'gray',
    textAlign: 'left',
  },
  iconHeart: {
    alignSelf: 'center',
  },
});