import React, { Component } from 'react'
import { View, Button, AsyncStorage } from 'react-native'

import theme from '../assets/theme'

export default class SignInScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={theme.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}