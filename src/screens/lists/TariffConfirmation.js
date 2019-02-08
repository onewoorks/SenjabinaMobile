import React, { Component } from 'react'
import { View, Text} from 'react-native'
import theme from '../../assets/theme'

export default class TariffConfirmationScreen extends Component{
    static navigationOptions = {
        title: 'Tariff Confirmation'
    };
    render(){
        return(
            <View style={theme.container}>
                <Text>Tariff Confirmation Screen</Text>
            </View>
        )
    }
}