import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import stylesLib from '../../../assets/styles/styles-lib';

export default function FoodCard({ name, image, description, price }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  function formatCurrency(number) {
    const formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);

    return formattedNumber;
  }

  return (
    <View style={styles.foodItemContainer}>
      <TouchableOpacity onPress={handleImagePress}>
        <Image source={{ uri: image }} style={styles.foodItemImage} />
      </TouchableOpacity>
      <View style={styles.foodItemDetails}>
        <Text style={styles.foodItemName}>{name}</Text>
        <Text style={styles.foodItemDescription}>{description}</Text>
        <Text style={styles.foodItemPrice}>{formatCurrency(price)}</Text>
      </View>
      <Modal visible={modalVisible} animationType="fade" transparent={false} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: image }} style={styles.modalImage} />
          <Text style={styles.modalName}>{name}</Text>
          <Text style={styles.modalDescription}>{description}</Text>
          <Text style={styles.modalPrice}>{formatCurrency(price)}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  foodItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: stylesLib.colSec.color,
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  foodItemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  foodItemDetails: {
    flex: 1,
    padding: 10,
  },
  foodItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  foodItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  modalName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDescription: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
  },
  modalPrice: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
