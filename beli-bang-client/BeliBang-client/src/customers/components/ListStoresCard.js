import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import stylesLib from '../../../assets/styles/styles-lib';

export default function ListStoresCard({ title, imageSource, sellerLatitude, sellerLongitude, userLatitude, userLongitude, storeId }) {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

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

  const distance = haversineDistance(userLatitude, userLongitude, sellerLatitude, sellerLongitude);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('DetailStore', { storeId })}>
      <View style={styles.cardContainer}>
        <Image source={{ uri: imageSource }} style={styles.cardImage} />
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.ratingDistanceContainer}>
            <View style={styles.starRating}>
              <FontAwesome name="star" size={24} color="gold" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
            <Text style={styles.cardDistance}>{`${distance.toFixed(2)} meters`}</Text>
          </View>
          <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? stylesLib.colTer.color : 'black'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 1 }, // for iOS
    shadowOpacity: 0.8, // for iOS
    shadowRadius: 2, // for iOS
    borderWidth: 5,
    borderColor: stylesLib.colSec.color
  },
  cardImage: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
  },
  cardDetails: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 5, // Added marginTop to separate distance from the rating
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 30,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  ratingDistanceContainer: {
    flexDirection: 'column', // Changed from 'row' to 'column'
    alignItems: 'flex-start', // Align items to the start
  },
});
