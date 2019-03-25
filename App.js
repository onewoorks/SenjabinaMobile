import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import SignInScreen from './src/screens/SignIn'
import HomeScreen from './src/screens/Home'
import AuthLoadingScreen from './src/screens/AuthLoading'
import OtherScreen from './src/screens/Other'
import TaskScreen from './src/screens/Task'
import VacantPremiseScreen from './src/screens/lists/VacantPremise'
import TariffConfirmationScreen from './src/screens/lists/TariffConfirmation'
import CommercialScreen from './src/screens/lists/Commercial'
import CommercialFormScreen from './src/screens/forms/CommercialForm'
import NonCommercialScreen from './src/screens/lists/NonCommercial'
import NonCommercialFormScreen from './src/screens/forms/NonCommercial'
import VacantPremiseFormScreen from './src/screens/forms/VacantPremiseForm'
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
  Commercial: CommercialScreen,
  CommercialForm: CommercialFormScreen,
  NonCommercial: NonCommercialScreen,
  NonCommercialForm: NonCommercialFormScreen,
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