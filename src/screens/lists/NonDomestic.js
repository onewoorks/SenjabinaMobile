import React, { Component } from 'react'
import { View, Text} from 'react-native'
import theme from '../../assets/theme'

export default class NonDomesticScreen extends Component{
    static navigationOptions = {
        title: 'Non Domestic'
    };
    render(){
        return(
            <View style={theme.container}>
                <Text>Non Domestic Screen</Text>
            </View>
        )
    }
}