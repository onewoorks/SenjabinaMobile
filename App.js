import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import SignInScreen from './src/screens/SignIn'
import HomeScreen from './src/screens/Home'
import AuthLoadingScreen from './src/screens/AuthLoading'
import OtherScreen from './src/screens/Other'
import TaskScreen from './src/screens/Task'
import VacantPremiseScreen from './src/screens/lists/VacantPremise'
import TariffConfirmationScreen from './src/screens/lists/TariffConfirmation'
import DomesticScreen from './src/screens/lists/Domestic'
import NonDomesticScreen from './src/screens/lists/NonDomestic'
import VacantPremiseFormScreen from './src/screens/lists/VacantPremiseForm'
import VacantPremiseCompletedScreen from './src/screens/lists/VacantPremiseComplete'
import VacantPremiseCompletedFormScreen from './src/screens/completed/VacantPremiseCompletedForm'
import UploadingScreen from './src/screens/Uploading'

import CodePush from 'react-native-code-push'

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Other: OtherScreen,
  Task: TaskScreen,
  VacantPremise: VacantPremiseScreen,
  TariffConfirmation: TariffConfirmationScreen,
  Domestic: DomesticScreen,
  NonDomestic: NonDomesticScreen,
  VacantPremiseForm: VacantPremiseFormScreen,
  VacantPremiseComplete: VacantPremiseCompletedScreen,
  VacantPremiseCompleteForm: VacantPremiseCompletedFormScreen,
  Uploading: UploadingScreen
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