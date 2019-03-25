import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import theme, { Menu } from '../assets/theme'
import { queryAllTaskListOpen, queryTaskDoneStatus, queryCompletedTaskNotUpload } from '../database/allSchemas'
import { COMPLETED, VACANT_PREMISE, NON_COMMERCIAL, UPLOADED, COMMERCIAL } from '../assets/constant'
import { Header } from 'react-navigation';

let menuList = [
    {
        label: 'Vacant Premise',
        'nav': 'VacantPremise',
        const: VACANT_PREMISE,
        'backgroundColor': '#fa983a',
    },
    {
        'label': 'Tariff Confirmation',
        'nav': 'TariffConfirmation',
        const: '',
        'backgroundColor': '#eb2f06'
    },
    {
        'label': 'Commercial',
        'nav': 'Commercial',
        const: COMMERCIAL,
        'backgroundColor': '#1e3799'
    },
    {
        'label': 'Domestic',
        'nav': 'NonCommercial',
        const: NON_COMMERCIAL,
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
            height: (height - Header.HEIGHT) / 4,
            uploadButton: false,
            listMenu: []
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

    async componentDidMount() {
        await this._taskNumber()
        let boxNumber = 4
        let uploadButton = false
        switch (this.state.form) {
            case 'completed':
                boxNumber = 5
                uploadButton = true
                break;
        }
        this.setState({
            height: (height - Header.HEIGHT) / boxNumber,
            uploadButton: uploadButton
        })

    }

    _uploadToServer = () => {
        if (this.state.uploadButton) {
            return (
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Uploading', {
                        form: COMPLETED,
                        module_name: 'all'
                    })} >
                        <View style={{
                            width: width,
                            alignItems: 'center', justifyContent: 'center',
                            height: this.state.height,
                            backgroundColor: '#78e08f'
                        }} >
                            <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>UPLOAD TO SERVER</Text>
                            <Text style={{ fontSize: 14, fontStyle: 'italic' }}>Required Internet Connection</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _menuList = () => {
        var view = []
        this.state.listMenu.forEach((v, k) => {
            view.push(
                <TouchableOpacity key={k} onPress={() => this.props.navigation.navigate(v.nav, {
                    form: this.state.form
                })} >
                    <View style={{
                        backgroundColor: v.backgroundColor, width: width,
                        alignItems: 'center', justifyContent: 'center',
                        height: this.state.height,
                    }} >
                        <Text style={Menu.numbers}>{v.tasks}</Text>
                        <Text style={{ fontSize: 20, color: '#fad390', fontWeight: 'bold' }}>{v.label.toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return view
    }

    _taskNumber = async () => {
        await menuList.forEach(async (v, k) => {
            switch (this.state.form) {
                case UPLOADED:
                    await queryTaskDoneStatus(v.const, UPLOADED).then((result) => {
                        menuList[k].tasks = result.length
                    })
                    break;
                case COMPLETED:
                    await queryCompletedTaskNotUpload(v.const).then((result) => {
                        menuList[k].tasks = result.length
                    })
                    break;
                default:
                    await queryAllTaskListOpen(v.const).then((result) => {
                        menuList[k].tasks = result.length
                    })
                    break;
            }

        })
        this.setState({
            listMenu: menuList
        })
    }

}