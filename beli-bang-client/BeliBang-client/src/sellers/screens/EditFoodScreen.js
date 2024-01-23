import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import stylesLib from '../../../assets/styles/styles-lib';
import * as React from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailFood, updateFood } from '../../../store/actions/actionCreator';
import { useEffect } from 'react';

export default function EditFoodScreen({ navigation, route }) {
  const foodId = route.params.id;
  const dispatch = useDispatch();
  const food = useSelector((state) => state.detailFood);
  const [name, setName] = React.useState(food.name);
  const [price, setPrice] = React.useState(food.price);
  const [description, setDescription] = React.useState(food.description);
  const [image, setImage] = React.useState(food.imageUrl);
  const [formDataImage, setFormDataImage] = React.useState({});
  const [accessToken, setAccessToken] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  let formData = new FormData();

  useEffect(() => {
    (async () => {
      try {
        let access_token = await SecureStore.getItemAsync('access_token');
        setAccessToken(access_token);
        const result = await dispatch(fetchDetailFood(foodId, access_token));
        setName(result.name);
        setPrice(result.price);
        setDescription(result.description);
        setImage(result.imageUrl);
        console.log('fetch detail food berhasil!');
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      let localUri = result.assets[0].uri;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      setFormDataImage({ uri: localUri, name: filename, type });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  function clickUpdateFood() {
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('imageUrl', formDataImage);

    dispatch(updateFood(formData, foodId, accessToken))
      .then((result) => {
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
        setAccessToken(null);
        console.log('SUCCESS UPDATE FOOD!');
        navigation.navigate('SellerHomeScreen');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <ScrollView style={[stylesLib.bgColPri, { flex: 1 }]}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={[stylesLib.pad20, { paddingTop: 20, paddingBottom: 80 }]}>
          <View>
            <Text style={[{ fontSize: 25, fontWeight: '800', padding: 7, textAlign:'center' }, stylesLib.colPri, stylesLib.bgColSec]}>UPDATE ITEM</Text>
          </View>
          <View style={[{ marginTop: 20 }]}>
            <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Name</Text>
            <TextInput value={name} onChangeText={(text) => setName(text)} style={[stylesLib.inputField, stylesLib.bgColPri, {fontSize: 20}]} />
            <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
          </View>
          <View style={[{ marginTop: 20 }]}>
            <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Price</Text>
            <TextInput value={(price).toString()} onChangeText={(text) => setPrice(text)} keyboardType="numeric" style={[stylesLib.inputField, stylesLib.bgColPri, {fontSize: 20}]} />
            <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
          </View>
          <View style={[{ marginTop: 20 }]}>
            <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Description</Text>
            <TextInput value={description} onChangeText={(text) => setDescription(text)} style={[stylesLib.inputField, stylesLib.bgColPri, {fontSize: 20}]} />
            <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
          </View>
          <View style={[{ marginTop: 40 }]}>
            <TouchableOpacity onPress={pickImage} style={[]}>
              <Text style={[stylesLib.colPri, stylesLib.bgColSec, stylesLib.pad10, { fontSize: 20, borderRadius: 20, textAlign: 'center', padding:3 }]}>PICK IMAGE</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center' }} />}
          </View>
          <View style={[{ marginTop: 20, alignSelf: 'center' }]}>
            <TouchableOpacity onPress={clickUpdateFood} style={[]}>
              <Text style={[stylesLib.colPri, stylesLib.bgColTer, stylesLib.pad20, { fontSize: 25, borderRadius: 20, textAlign: 'center', padding: 5, fontWeight:'700' }]}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemTitle: {
    textDecorationLine: 'underline',
    fontWeight: '900',
    fontSize: 20,
  },
  item: {
    fontSize: 20,
  },
});
