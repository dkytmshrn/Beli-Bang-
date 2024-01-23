import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateProfile } from '../../../store/actions/actionCreator';
import * as React from 'react';
import { Avatar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import ProfilePictureModal from './ProfilePictureModal';
import stylesLib from '../../../assets/styles/styles-lib';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => {
    return state.user;
  });
  const [userId, setUserId] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState(false);
  const [username, setUsername] = React.useState(user.username);
  const [phoneNumber, setPhoneNumber] = React.useState(user.phoneNumber);
  const [address, setAddress] = React.useState(user.address);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [editableFields, setEditableFields] = React.useState({
    username: false,
    email: false,
    phoneNumber: false,
    address: false,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      try {
        let UserId = await SecureStore.getItemAsync('userId');
        let access_token = await SecureStore.getItemAsync('access_token');
        setAccessToken(access_token);
        setUserId(UserId);
        const data = await dispatch(fetchUser(UserId, access_token));
        setUsername(data.username);
        setPhoneNumber(data.phoneNumber);
        setAddress(data.address);

        console.log('fetch detail user berhasil!');
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    })();
  }, []);

  const handleEdit = (field) => {
    // cuma handle field nya aja
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleSave = async (field) => {
    // hit API untuk edit
    try {
      setEditableFields({ ...editableFields, [field]: false });
      if (field == 'username') {
        await dispatch(updateProfile(field, username, accessToken, userId));
      }
      if (field == 'phoneNumber') {
        await dispatch(updateProfile(field, phoneNumber, accessToken, userId));
      }
      if (field == 'address') {
        await dispatch(updateProfile(field, address, accessToken, userId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const clickSignOut = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('role');
    await SecureStore.deleteItemAsync('userId');
    return navigation.navigate('LoginScreen');
  };

  const handleUsername = (value) => {
    setUsername(value);
  };

  const handlePhoneNumber = (value) => {
    setPhoneNumber(value);
  };

  const handleAddress = (value) => {
    setAddress(value);
  };

  const renderEditSaveButtons = (field) => {
    return (
      <>
        {!editableFields[field] && (
          <TouchableOpacity onPress={() => handleEdit(field)}>
            <FontAwesome name="edit" size={25} style={[stylesLib.colTer]} />
          </TouchableOpacity>
        )}
        {editableFields[field] && (
          <TouchableOpacity onPress={() => handleSave(field)}>
            <FontAwesome name="save" size={25} style={[stylesLib.colTer]} />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <ScrollView style={[stylesLib.pad30, styles.container]}>
      <View>
        {isLoading ? (
          <View style={[stylesLib.pad10, stylesLib.center, { height: '100%', justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View>
            <View style={[{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, marginBottom: 10 }]}>
              <TouchableOpacity onPress={() => clickSignOut()}>
                <Text style={[stylesLib.colPri, stylesLib.pad10, { fontSize: 20, borderRadius: 20, backgroundColor: stylesLib.bgColTer.backgroundColor }]}>LOGOUT</Text>
              </TouchableOpacity>
            </View>
            <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 50 }]}>
              <TouchableOpacity onPress={toggleModal}>
                <View style={[{ alignItems: 'center', borderWidth: 5, borderColor: stylesLib.colSec.color, borderRadius: 70, overflow: 'hidden' }]}>
                  <Avatar.Image size={120} source={{ uri: user.profilePicture }} />
                </View>
              </TouchableOpacity>
            </View>
            <ProfilePictureModal isVisible={isModalVisible} toggleModal={toggleModal} profilePictureUri={user.profilePicture} />
            <View style={[stylesLib.pad20, {borderWidth: 5, paddingTop:30, paddingBottom:40, borderRadius:10, borderColor: stylesLib.colSec.color}]}>
              <View style={[{ marginBottom: 20 }]}>
                <Text style={[{ marginBottom: 5 }, stylesLib.colSec, styles.itemTitle]}>Email</Text>
                <Text style={[styles.item, stylesLib.colSec]}>{user.email}</Text>
              </View>
              <View style={[{ marginBottom: 20 }]}>
                <Text style={[{ marginBottom: 5 }, stylesLib.colSec, styles.itemTitle]}>Username</Text>
                <View style={[{ flexDirection: 'row' }]}>
                  <View style={[stylesLib.flex9, { marginRight: 20 }]}>
                    {editableFields.username ? (
                      <View>
                        <TextInput
                          style={[styles.item, stylesLib.colSec, stylesLib.bgColPri, { borderRadius: 10 }]}
                          value={username}
                          onChangeText={(value) => {
                            handleUsername(value);
                          }}
                        />
                        <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
                      </View>
                    ) : (
                      <Text style={[styles.item, stylesLib.colSec]}>{user.username}</Text>
                    )}
                  </View>
                  <View style={[stylesLib.flex1]}>{renderEditSaveButtons('username')}</View>
                </View>
              </View>
              <View style={[{ marginBottom: 20 }]}>
                <Text style={[{ marginBottom: 5 }, stylesLib.colSec, styles.itemTitle]}>Phone Number</Text>
                <View style={[{ flexDirection: 'row' }]}>
                  <View style={[stylesLib.flex9, { marginRight: 20 }]}>
                    {editableFields.phoneNumber ? (
                      <View>
                        <TextInput
                          style={[styles.item, stylesLib.colSec, stylesLib.bgColPri, { borderRadius: 10 }]}
                          value={phoneNumber}
                          onChangeText={(value) => {
                            handlePhoneNumber(value);
                          }}
                          keyboardType="numeric"
                        />
                        <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
                      </View>
                    ) : (
                      <Text style={[styles.item, stylesLib.colSec]}>{user.phoneNumber}</Text>
                    )}
                  </View>
                  <View style={[stylesLib.flex1]}>{renderEditSaveButtons('phoneNumber')}</View>
                </View>
              </View>
              <View style={[{ marginBottom: 20 }]}>
                <Text style={[{ marginBottom: 5 }, stylesLib.colSec, styles.itemTitle]}>Address</Text>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                  <View style={[stylesLib.flex9, { marginRight: 20 }]}>
                    {editableFields.address ? (
                      <View>
                        <TextInput
                          style={[styles.item, stylesLib.colSec, stylesLib.bgColPri, { borderRadius: 10 }]}
                          value={address}
                          onChangeText={(value) => {
                            handleAddress(value);
                          }}
                        />
                        <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
                      </View>
                    ) : (
                      <Text style={[styles.item, stylesLib.colSec]}>{user.address}</Text>
                    )}
                  </View>
                  <View style={[stylesLib.flex1]}>{renderEditSaveButtons('address')}</View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stylesLib.bgColGrLight.backgroundColor,
  },
  itemTitle: {
    textDecorationLine: 'underline',
    fontWeight: '900',
    fontSize: 20,
  },
  item: {
    fontSize: 20,
  },
});
