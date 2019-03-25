import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import theme, {ThemeBase} from '../../assets/theme'
import {
    queryAllTaskListOpen,
    sewaccFilter,
    sewaccCompletedFilter,
    queryNotUploadYetCompletedTask,
    queryUploadedCompletedTask,
    queryTaskDoneStatus
} from '../../database/allSchemas'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'
import { VACANT_PREMISE, UPLOADED } from '../../assets/constant'

export default class VacantPremiseScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const state = navigation
        switch (state.state.params.form) {
            case 'uploaded':
                return ({
                    title: 'List of Vacant Premises',
                    headerStyle: {
                        backgroundColor: '#fa983a'
                    },
                    headerRight: (
                        <Icon
                            name="md-cloud-upload"
                            onPress={() => navigation.state.params.handleUpload()}
                            size={30}
                            style={{ marginRight: 10, color: '#fff' }} />
                    )
                })
            case 'completed':
            default:
                return ({
                    title: 'List of Vacant Premises',
                    headerStyle: {
                        backgroundColor: '#fa983a'
                    }
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
        this.props.navigation.navigate('Uploading', {
            form: this.props.navigation.getParam('form'),
            module_name: VACANT_PREMISE
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
        queryAllTaskListOpen('vacant_premise').then((taskList) => {
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
        queryNotUploadYetCompletedTask(VACANT_PREMISE).then((taskList) => {
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
        queryTaskDoneStatus(VACANT_PREMISE, UPLOADED).then((taskList) => {
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
                    style={[{ flex: 1}, ThemeBase.flatList]}
                    data={this.state.taskList}
                    extraData={this.state}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {
                        let taskdetail = JSON.parse(item.taskdetail)
                        return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('VacantPremiseForm', {
                                    data: item,
                                    id: item.id,
                                    seq_id: taskdetail.seq_id,
                                    title: taskdetail.sewacc,
                                    form: this.state.listing
                                })}>
                                <View style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: '#dadada', padding: 10 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>ID: {taskdetail.seq_id} | SEWACC: {taskdetail.sewacc}</Text>
                                    <Text style={{ fontStyle: 'italic' }}>{taskdetail.la_name}</Text>
                                    <Text style={{ fontStyle: 'italic' }}>{taskdetail.property_address}</Text>
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
            case 'completed':
                sewaccCompletedFilter(sewaccInput).then((sewaccFilter) => {
                    this.setState({
                        taskList: sewaccFilter
                    })
                })
                break;
            case 'new':
                sewaccFilter(sewaccInput,VACANT_PREMISE).then((sewaccFilter) => {
                    this.setState({
                        taskList: sewaccFilter
                    })
                })
                break;
        }
    }
}