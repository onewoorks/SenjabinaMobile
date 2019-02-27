import React, { Component } from 'react'
import { View, Text} from 'react-native'
import theme from '../../assets/theme'

export default class TariffConfirmationScreen extends Component{
    static navigationOptions = {
        title: 'Tariff Confirmation',
        headerStyle: {
            backgroundColor: '#eb2f06'
        },
        headerTintColor: 'white'
    };
    render(){
        return(
            <View style={theme.tariffContainer}>
                <Text>Tariff Confirmation Screen</Text>
            </View>
        )
    }
}