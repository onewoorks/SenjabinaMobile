import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import SignInScreen from './src/screens/SignIn'
import HomeScreen from './src/screens/Home'
import AuthLoadingScreen from './src/screens/AuthLoading'
import OtherScreen from './src/screens/Other'

import CodePush from 'react-native-code-push'

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Other: OtherScreen
});

const AuthStack = createStackNavigator({
  SignIn: SignInScreen
});

const Root = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


let codepushoptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START
}

AppC = CodePush(codepushoptions)(Root)
export default AppC;