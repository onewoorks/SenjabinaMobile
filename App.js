/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = ({
      image: null,
      showme: false
    })
  }
  _pickImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
    });
  }

  _pickImageFromAlbum = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      includeBase64: true,
      cropping: true
    }).then(image => {
      console.log(image.data);
      this.setState({
        showme: true,
        image: image
      })
      return (<View><Text>test</Text></View>)

      // renderImage = (image) => {
      // return <Image style={styles.icon} source={image} />
      // }    
    });
  }

  _showImage = (showme) => {
    if (showme == true) {
      var base64Icon = 'data:image/png;base64,' + this.state.image.data;

      return (
        <View>
          <Image
            style={{ width: 500, height: 500, borderWidth: 1 }} source={{ uri: base64Icon }} />

        </View>
      )
    } else {
      return (
        <View><Text>False</Text></View>
      )
    }

  }

  render() {
    console.log('render');
    return (
      <View style={styles.container}>
        {this._showImage(this.state.showme)}
        <Text style={styles.welcome}>Welcome...!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button title='Image Picker | Camera' onPress={() => this._pickImage()} />
        <Button title='Image Picker | Album' onPress={() => this._pickImageFromAlbum()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});