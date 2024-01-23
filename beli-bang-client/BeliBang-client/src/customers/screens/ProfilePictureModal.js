import { Modal, Pressable, View, Image, Text } from 'react-native';
import stylesLib from '../../../assets/styles/styles-lib';
import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { updateProfilePicture } from '../../../store/actions/actionCreator';

const ProfilePictureModal = ({ isVisible, toggleModal, profilePictureUri }) => {
  const dispatch = useDispatch();
  const [image, setImage] = React.useState('');
  const [access_token, setAccess_Token] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [newImage, setNewImage] = React.useState(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [formDataImage, setFormDataImage] = React.useState({});
  let formData = new FormData();

  async function getAccessToken(key) {
    let result = await SecureStore.getItemAsync(key);
    setAccess_Token(result);
  }
  async function getUserId(key) {
    let result = await SecureStore.getItemAsync(key);
    setUserId(result);
  }

  getAccessToken('access_token');
  getUserId('userId');

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

      let localUri = result.assets[0].uri;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      setFormDataImage({ uri: localUri, name: filename, type });
      if (!result.canceled) {
        setNewImage(result.assets[0].uri);
        setIsEditMode(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveChanges = async () => {
    formData.append('profilePicture', formDataImage);
    await dispatch(updateProfilePicture(formData, access_token, userId));
    console.log('save PP success');
    setIsEditMode(false);
    toggleModal();
  };

  const handleClose = () => {
    setIsEditMode(false);
    toggleModal();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={toggleModal}>
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={[stylesLib.bgColSec, { width: '80%', height: '55%', borderRadius: 20 }]}>
          <Image style={{ flex: 1, resizeMode: 'contain' }} source={{ uri: isEditMode ? newImage : profilePictureUri }} />
          <Pressable style={{ position: 'absolute', top: 20, right: 20 }} onPress={handleClose}>
            <FontAwesome name="times" size={30} style={[stylesLib.colTer]} />
          </Pressable>
          <Pressable style={{ position: 'absolute', bottom: 15, alignSelf: 'center' }} onPress={isEditMode ? handleSaveChanges : pickImage}>
            <Text
              style={[
                stylesLib.bgColTer,
                stylesLib.pad40,
                stylesLib.colPri,
                {
                  padding: 10,
                  borderRadius: 20,
                  fontWeight: '700',
                  fontSize: 15,
                },
              ]}
            >
              {isEditMode ? 'Save Changes' : 'New Profile Image'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ProfilePictureModal;
