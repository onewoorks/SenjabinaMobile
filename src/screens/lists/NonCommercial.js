import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import theme, { ThemeBase } from '../../assets/theme'
import {
    queryAllTaskListOpen,
    sewaccFilter,
    sewaccCompletedFilter,
    queryNotUploadYetCompletedTask,
    queryTaskDoneStatus
} from '../../database/allSchemas'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'
import { NON_COMMERCIAL, UPLOADED } from '../../assets/constant'

export default class NonCommercial extends Component {
    static navigationOptions = ({ navigation }) => {
        const state = navigation
        switch (state.state.params.form) {
            case 'uploaded':
                return ({
                    title: 'List of Non Commercial',
                    headerStyle: {
                        backgroundColor: '#3c6382'
                    },
                    headerTintColor: 'white',
                    headerRight: (
                        <Icon
                            name="md-cloud-upload"
                            onPress={() => navigation.state.params.handleUpload()}
                            size={30}
                            style={{ marginRight: 10, color: '#fff' }} />
                    )
                })
                break;
            default:
                return ({
                    title: 'List of Non Commercial',
                    headerStyle: {
                        backgroundColor: '#3c6382'
                    },
                    headerTintColor: 'white'
                })
                break;
        }

    };

    constructor(props) {
        super(props)
        this.state = {
            taskList: {},
            listing: this.props.navigation.getParam('form'),
            search: '',
            sewaccInput: '',
            filterQuery: false
        }
        this.willFocus = this.props.navigation.addListener('willFocus', () => {
            this._reloadData()
        });
    }

    _handleUpload = () => {
        this.props.navigation.navigate('Uploading',{
            form:this.props.navigation.getParam('form'),
            module_name: NON_COMMERCIAL
        })
    }

    _updateSearch = search => {
        this.setState({ search });
    };

    _reloadData = () => {
        let list_condition = this.state.listing
        switch (list_condition) {
            case 'completed':
                this._openCompleted()
                break;
            case 'uploaded':
                this._openUploaded()
                break;
            case 'new':
                this._openTask()
                break;
        }
    }

    _openTask = () => {
        queryAllTaskListOpen(NON_COMMERCIAL).then((taskList) => {
            this.setState({
                taskList: taskList
            })
        }).catch((error) => {
            this.setState({
                taskList: {}
            })
        })
    }

    _openCompleted = () => {
        queryNotUploadYetCompletedTask().then((taskList) => {
            this.setState({
                taskList: taskList
            })
        }).catch((error) => {
            this.setState({
                taskList: {}
            })
        })
    }

    _openUploaded = () => {
        queryTaskDoneStatus(NON_COMMERCIAL,UPLOADED).then((taskList) => {
            this.setState({
                taskList: taskList
            })
        }).catch((error) => {
            this.setState({
                taskList: {}
            })
        })
    }

    componentDidMount() {
        switch (this.state.listing) {
            case 'uploaded':
            case 'completed':
                this.props.navigation.setParams({ handleUpload: this._handleUpload })
                break;
        }
        this._reloadData()
    }

    render() {
        return (
            <View style={theme.container}>
                <View style={[theme.width100]}>
                    <View>
                        <Input placeholder="Sequence Id..."
                            keyboardType="numeric"
                            leftIcon={
                                <Icon
                                    name='md-search'
                                    size={24}
                                    color='black'
                                />
                            }
                            onChangeText={(sewaccInput) => this._querySewacc(sewaccInput)}
                        />
                    </View>

                </View>
                <FlatList
                    style={ThemeBase.flatList}
                    data={this.state.taskList}
                    extraData={this.state}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {
                        let taskdetail = JSON.parse(item.taskdetail)
                        return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('NonCommercialForm', {
                                    data: item,
                                    id: item.id,
                                    seq_id: taskdetail.id,
                                    title: taskdetail.san,
                                    form: this.state.listing,
                                    tab: taskdetail.sheet_code
                                })}>
                                <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: '#dadada', padding: 10 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>ID: {taskdetail.id} | SAN: {taskdetail.san}</Text>
                                    <Text style={{ fontStyle: 'italic' }}>{taskdetail.la_name}, {taskdetail.state} </Text>
                                    <Text style={{ fontStyle: 'italic' }}>
                                        {taskdetail.prop_address_1 +
                                            ', ' + taskdetail.prop_address_2 +
                                            ', ' + taskdetail.prop_address_3 +
                                            ', ' + taskdetail.prop_address_4 +
                                            ', ' + taskdetail.prop_address_5
                                        }
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }

    _querySewacc = (sewaccInput) => {
        switch (this.state.listing) {
            case 'uploaded':
            case 'completed':
                sewaccCompletedFilter(sewaccInput).then((sewaccFilter) => {
                    this.setState({
                        taskList: sewaccFilter
                    })
                })
                break;
            case 'new':
                sewaccFilter(sewaccInput,NON_COMMERCIAL).then((sewaccFilter) => {
                    this.setState({
                        taskList: sewaccFilter
                    })
                })
                break;
        }
    }
}