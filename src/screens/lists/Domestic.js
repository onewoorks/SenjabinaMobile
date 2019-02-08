import React, { Component } from 'react'
import { View, Text} from 'react-native'
import theme from '../../assets/theme'

export default class DomesticScreen extends Component{
    static navigationOptions = {
        title: 'Domestic'
    };
    render(){
        return(
            <View style={theme.container}>
                <Text>Domestic Screen</Text>
            </View>
        )
    }
}