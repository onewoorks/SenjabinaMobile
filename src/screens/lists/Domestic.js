import React, { Component } from 'react'
import { View, Text} from 'react-native'
import theme from '../../assets/theme'

export default class DomesticScreen extends Component{
    static navigationOptions = {
        title: 'Domestic',
        headerStyle: {
            backgroundColor:'#4a69bd'
        },
        headerTintColor: 'white'
    };
    render(){
        return(
            <View style={theme.domesticContainer}>
                <Text>Domestic Screen</Text>
            </View>
        )
    }
}