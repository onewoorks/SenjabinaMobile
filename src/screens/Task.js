import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import theme from '../assets/theme'

import { insertNewTaskList } from '../database/allSchemas'

const height = Dimensions.get('window').height/4
const width = Dimensions.get('window').width

let menuList = [
    {
        'label': 'Vacant Premise',
        'nav': 'VacantPremise',
        'backgroundColor': '#fa983a'
    },
    {
        'label': 'Tariff Confirmation',
        'nav': 'TariffConfirmation',
        'backgroundColor': '#eb2f06'
    },
    {
        'label': 'Domestic',
        'nav': 'Domestic',
        'backgroundColor': '#1e3799'
    },
    {
        'label': 'Non Domestic',
        'nav': 'NonDomestic',
        'backgroundColor': '#3c6382'
    }
]

export default class TaskScreen extends Component {
    static navigationOptions = {
        title: 'Task Categories',
        // headerTransparent: 'false'
    };

    _menuList = () => {
        var view = []
        menuList.forEach((v, k) => {
            view.push(
                <TouchableOpacity key={k} onPress={() => this.props.navigation.navigate(v.nav)} >
                    <View style={{backgroundColor:v.backgroundColor, width:width, height:height, alignItems:'center', justifyContent:'center'}} >
                        <Text style={{fontSize: 20, color: '#fad390', fontWeight:'bold'}}>{v.label.toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return view
    }


    render() {
        return (
            <View style={theme.menuContainer}>
                {this._menuList()}
            </View>
        )
    }
}