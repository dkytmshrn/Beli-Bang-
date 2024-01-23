import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import stylesLib from '../../assets/styles/styles-lib';
import iconBB from '../../assets/belibang-CB.png'

export default function RegisterScreen({ navigation }) {
  return (
    <View style={[stylesLib.bgColGrLight, stylesLib.flex1]}>
      <View style={[{ marginTop:20 }]}>
        <Image source={iconBB} style={[stylesLib.logo]} />
      </View>
      <View style={{ justifyContent: 'center', height: '40%', marginBottom:20 }}>
        <View style={[stylesLib.pad50, { marginBottom: 30}]}>
          <Text style={[stylesLib.colCr, stylesLib.padL20, stylesLib.inputLabel]}>username</Text>
          <TextInput style={[stylesLib.bgColCr ,stylesLib.inputField]} />
        </View>
        <View style={[stylesLib.pad50]}>
          <Text style={[stylesLib.colCr, stylesLib.padL20, stylesLib.inputLabel]}>password</Text>
          <TextInput style={[stylesLib.bgColCr, stylesLib.inputField]} />
        </View>
      </View>
      <View>
        <Text style={[{ textAlign: 'center', fontSize: 25}, stylesLib.colCr]}>already have an account?</Text>
      </View>
      <View style={[{ flexDirection: 'row', justifyContent: 'center' }]}>
        <Text style={[{ textAlign: 'center', fontSize: 25, marginBottom: 20 }, stylesLib.colCr]}>log in</Text>
        <TouchableOpacity onPress={() => clickHere()} style={[style.activeLink, { marginLeft: 9 }]}>
          <Text style={[style.loginLink]}>here</Text>
        </TouchableOpacity>
      </View>
      <View style={style.switchButtonContainer}>
        <TouchableOpacity onPress={() => clickHere()} style={[style.footerText, { marginRight: 30 }]}>
          <Text style={[style.inactiveLink, stylesLib.colGrBold, stylesLib.bgColCrBold, stylesLib.pad10, style.roundedLink]}>Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => clickHere()} style={[style.footerText, { marginLeft: 30 }]}>
          <Text style={[style.activeLink, stylesLib.colGrBold, stylesLib.bgColCr,stylesLib.pad10, style.roundedLink]}>Seller</Text>
        </TouchableOpacity>
      </View>
      <View style={[{alignItems:'center'}]}>
        <Button mode="contained" style={[stylesLib.bgColCr]} labelStyle={[stylesLib.colGrLight, { fontSize: 22 }]}>Sign Up</Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  activeLink : {
    fontSize: 25,
    color: '#FEF5ED',
  },
  loginLink : {
    fontSize: 25,
    color: '#FEF5ED',
    textDecorationLine: 'underline',
    fontWeight: '900'
  },
  switchButtonContainer : {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40
  },
  inactiveLink : {
    fontSize: 25,
  },
  roundedLink : {
    borderRadius: 20
  }
})
