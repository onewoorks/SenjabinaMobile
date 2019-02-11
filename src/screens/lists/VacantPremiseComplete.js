import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import theme from '../../assets/theme'
import { sewaccCompletedFilter, queryNotUploadYetCompletedTask } from '../../database/allSchemas'
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'

export default class VacantPremiseCompleteScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: 'Completed Vacant Premises',
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

    };

    constructor(props) {
        super(props)
        this.state = {
            taskList: {},
            search: '',
            sewaccInput: '',
            filterQuery: false
        }
        this.willFocus = this.props.navigation.addListener('willFocus', () => {
            this._reloadData()
          });
    }

    _handleUpload = () => {
        this.props.navigation.navigate('Uploading')
    }

    _updateSearch = search => {
        this.setState({ search });
    };

    _reloadData = () => {
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

    componentDidMount() {
        this.props.navigation.setParams({ handleUpload: this._handleUpload })
        this._reloadData()
    }

    render_x() {
        return (
            <View style={theme.container}>
                <Listing
                    style={{ width: 400 }}
                    items={this.state.taskList} navigate={this.props.navigation}
                />
            </View>
        )
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
                    style={{ flex: 1 }}
                    data={this.state.taskList}
                    extraData={this.state}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {
                        let taskdetail = JSON.parse(item.taskdetail)
                        return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('VacantPremiseCompleteForm', {
                                    data: item,
                                    id: item.id,
                                    seq_id: taskdetail.seq_id,
                                    title: taskdetail.sewacc
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
        sewaccCompletedFilter(sewaccInput).then((sewaccFilter) => {
            this.setState({
                taskList: sewaccFilter
            })
        })
    }
}