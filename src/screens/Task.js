import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import theme from '../assets/theme'

let menuList = [
    {
        'label': 'Vacant Premise',
        'nav': 'VacantPremise',
        'backgroundColor': '#fa983a',
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
        'label': 'Non Commercial',
        'nav': 'NonCommercial',
        'backgroundColor': '#3c6382'
    }
]

const height = (Dimensions.get('window').height)
const width = Dimensions.get('window').width

export default class TaskScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
        return {
            title: 'Task Categories ' + '(' + state.params.title + ')',
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            form: this.props.navigation.getParam('form'),
            height: height / 4,
            uploadButton: false
        }
    }

    render() {
        return (
            <View style={[theme.menuContainer]}>
                {this._menuList()}
                {this._uploadToServer()}
            </View>
        )
    }

    componentDidMount() {
        let boxNumber = 4
        let uploadButton = false
        switch (this.state.form) {
            case 'completed':
                boxNumber = 5
                uploadButton = true
                break;
        }
        this.setState({
            height: height / boxNumber,
            uploadButton: uploadButton
        })
    }

    _uploadToServer = () => {
        if (this.state.uploadButton) {
            return (
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Uploading')} >
                        <View style={{
                            width: width,
                            alignItems: 'center', justifyContent: 'center',
                            height: this.state.height,
                            backgroundColor: '#78e08f'
                        }} >
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>UPLOAD TO SERVER</Text>
                            <Text style={{fontSize: 14, fontStyle:'italic'}}>Required Internet Connection</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _menuList = () => {
        var view = []
        menuList.forEach((v, k) => {
            view.push(
                <TouchableOpacity key={k} onPress={() => this.props.navigation.navigate(v.nav, {
                    form: this.state.form
                })} >
                    <View style={{
                        backgroundColor: v.backgroundColor, width: width,
                        alignItems: 'center', justifyContent: 'center',
                        height: this.state.height
                    }} >
                        <Text style={{ fontSize: 20, color: '#fad390', fontWeight: 'bold' }}>{v.label.toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return view
    }

}