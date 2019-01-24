import React, {Component} from 'react'
import { AsyncStorage, View, Button, StatusBar } from 'react-native'
import theme from '../assets/theme'

import TaskListData from '../components/taskListData'

export default class OtherScreen extends Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={theme.container}>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
        <TaskListData />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}