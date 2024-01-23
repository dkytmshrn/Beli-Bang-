import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import stylesLib from '../../assets/styles/styles-lib';
import iconBB from '../../assets/belibang-CB.png';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../store/actions/actionCreator';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Customer');
  const [hidePass, setHidePass] = useState(true);
  const dispatch = useDispatch();

  async function saveAccessToken(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function saveRole(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function saveUserId(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  function clickSignup() {
    const inputForm = {
      username,
      email,
      password,
      phoneNumber,
      address,
      role,
    };

    dispatch(register(inputForm))
      .then((result) => {
        console.log(result, '<<<<< ini payload');
        saveAccessToken('access_token', result.access_token);
        saveRole('role', result.role);
        saveUserId('userId', result.id.toString());
        setUsername('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setAddress('');
        setRole('Customer');
        setHidePass(true);
        if (result.role === 'Customer') {
          navigation.navigate('CustomerTab');
        } else if (result.role === 'Seller') {
          navigation.navigate('RegisterStore');
        }
        console.log('REGISTER SUCCESS!');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <ScrollView style={[stylesLib.bgColGrLight, stylesLib.flex1]}>
      <View style={[{ marginTop: 20, marginBottom: 60 }]}>
        <Image source={iconBB} style={[stylesLib.logo]} />
      </View>
      <View style={{ justifyContent: 'center', marginBottom: 20 }}>
        <View style={[stylesLib.pad40, { marginBottom: 20 }]}>
          <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Username</Text>
          <TextInput style={[stylesLib.bgColPri, stylesLib.inputField, {fontSize:22}]} onChangeText={setUsername} />
          <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
        </View>
        <View style={[stylesLib.pad40, { marginBottom: 20 }]}>
          <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Email</Text>
          <TextInput style={[stylesLib.bgColPri, stylesLib.inputField, {fontSize:22}]} onChangeText={setEmail} />
          <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
        </View>
        <View style={[stylesLib.pad40, { marginBottom: 20 }]}>
          <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Password</Text>
          <TextInput
            style={[stylesLib.bgColPri, stylesLib.inputField, {fontSize:22}]}
            onChangeText={setPassword}
            secureTextEntry={hidePass ? true : false}
            autoCapitalize="none"
            returnKeyType="next"
            right={<TextInput.Icon icon="eye" onPress={() => setHidePass(!hidePass)} />}
          />
          <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
        </View>
        <View style={[stylesLib.pad40, { marginBottom: 20 }]}>
          <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Phone Number</Text>
          <TextInput style={[stylesLib.bgColPri, stylesLib.inputField, {fontSize:22}]} onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" />
          <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
        </View>
        <View style={[stylesLib.pad40, { marginBottom: 20 }]}>
          <Text style={[stylesLib.colSec, stylesLib.inputLabel]}>Address</Text>
          <TextInput style={[stylesLib.bgColPri, stylesLib.inputField, {fontSize:22}]} onChangeText={setAddress} />
          <View style={{ borderBottomWidth: 2, borderBottomColor: stylesLib.colSec.color }} />
        </View>
      </View>
      
      <View style={style.switchButtonContainer}>
        <TouchableOpacity onPress={() => setRole('Customer')} style={[style.footerText, { marginRight: 30 }]}>
          <Text style={[role === 'Customer' ? style.activeLink : style.inactiveLink, role === 'Customer' ? [stylesLib.bgColSec, stylesLib.colPri] : [stylesLib.bgColPri, stylesLib.colSec], stylesLib.pad10, style.roundedLink, {padding:3}]}>Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('Seller')} style={[style.footerText, { marginLeft: 30 }]}>
          <Text style={[role === 'Seller' ? style.activeLink : style.inactiveLink, stylesLib.colGrBold, role === 'Seller' ? [stylesLib.bgColSec, stylesLib.colPri] : [stylesLib.bgColPri, stylesLib.colSec], stylesLib.pad10, style.roundedLink, {padding:3}]}>Seller</Text>
        </TouchableOpacity>
      </View>
      <View style={[{ alignItems: 'center', marginBottom:20 }]}>
        <Button mode="contained" style={[stylesLib.bgColTer]} labelStyle={[stylesLib.colGrLight, { fontSize: 22, fontWeight:'700' }]} onPress={clickSignup}>
          Sign Up
        </Button>
      </View>
      <View>
        <Text style={[{ textAlign: 'center', fontSize: 25, marginTop: 30 }, stylesLib.colSec]}>already have an account?</Text>
      </View>
      <View style={[{ flexDirection: 'row', justifyContent: 'center' }]}>
        <Text style={[{ textAlign: 'center', fontSize: 25, marginBottom: 40 }, stylesLib.colSec]}>log in</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={[style.activeLink, { marginLeft: 9 }]}>
          <Text style={[style.loginLink, stylesLib.colSec]} onPress={() => navigation.navigate('LoginScreen')}>
            here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  activeLink: {
    fontSize: 25,
    color: '#FEF5ED',
  },
  loginLink: {
    fontSize: 25,
    color: '#FEF5ED',
    textDecorationLine: 'underline',
    fontWeight: '900',
  },
  switchButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  inactiveLink: {
    fontSize: 25,
  },
  roundedLink: {
    borderRadius: 20,
  },
});
