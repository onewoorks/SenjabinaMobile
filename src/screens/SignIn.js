import React, { Component } from 'react'
import { View, Button, AsyncStorage, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements'
import config from '../assets/config';
import theme from '../assets/theme'
import Env from '../assets/config';

export default class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props)
    this.state = {
      identificationNo: null,
      registeredMobileNo: null,
      userData: null,
      validLogin: false,
      buttonLoginLabel: 'LOGIN ACCOUNT'
    }
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/loginBg.jpg')} style={{ width: '100%', height: '100%' }}>
        <View style={{ alignItems: 'stretch', flexDirection: 'column-reverse', flex: 1, alignContent: 'center', alignItems:'center' }}>
          <TouchableOpacity onPress={this._verifyUser} style={[theme.fullBlock, { marginTop: 20 }]}>
            <Text style={theme.fullBlockText}>{this.state.buttonLoginLabel}</Text>
          </TouchableOpacity>
          <Input
            placeholder='Registered Mobile No'
            keyboardType='number-pad'
            onFocus={this._clearError}
            containerStyle={{ backgroundColor: '#fff', alignItems: 'center', alignContent: 'center' }}
            onChangeText={(registeredMobileNo) => this.setState({ registeredMobileNo })}
            value={this.state.registeredMobileNo}
          />
          <Input placeholder='Identification No'
            keyboardType='numeric'
            containerStyle={{ backgroundColor: '#fff' }}
            onFocus={this._clearError}
            onChangeText={(identificationNo) => this.setState({ identificationNo })}
            value={this.state.identificationNo}
          />
        </View>

      </ImageBackground>
    );
  }

  _clearError = () => {
    this.setState({
      buttonLoginLabel: 'LOGIN'
    })
  }

  _verifyUser = () => {
    this.setState({
      buttonLoginLabel: 'VERIFYING...'
    })
    fetch(Env.BASE_URL + 'user/verify-user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identificationNo: this.state.identificationNo,
        registeredMobileNo: this.state.registeredMobileNo,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (JSON.stringify(responseJson.response) === 'false') {
          this.setState({
            buttonLoginLabel: "LOGIN ERROR"
          })
        } else {
          AsyncStorage.setItem('userToken', JSON.stringify(responseJson.response))
          this.props.navigation.navigate('App');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    // await AsyncStorage.setItem('user_info', JSON.stringify(user_info))
    this.props.navigation.navigate('App');

  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignContent: 'flex-end',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  loginForm: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
});