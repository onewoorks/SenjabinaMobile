import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, AsyncStorage } from 'react-native'
import theme from '../../assets/theme'
import { Input, CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker';
import { updateTaskDone, updateTaskList } from '../../database/allSchemas';

const w = Dimensions.get('window').width / 3

export default class VacantPremiseCompletedForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskid: this.props.navigation.getParam('id'),
            taskData: this.props.navigation.getParam('data'),
            seq_id: this.props.navigation.getParam('seq_id'),
            sewacc: '',
            image: [],
            showme: true,
            remarks: '',
            occupied: true
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            title: 'Vacant Premise : ' + state.params.title,
            headerStyle: {
                backgroundColor: '#fa983a',
                tintColor: '#fff'
            }
        };
    };

    render() {
        let task = JSON.parse(this.state.taskData.taskdetail)
        return (
            <ScrollView>
                <View style={theme.formViewArea}>
                    <View style={theme.formView}>
                        <Text style={theme.formViewLabel}>Owner Name : </Text>
                        <Text style={theme.formVacantText}>{task.owner_name}</Text>
                    </View>
                    <View style={theme.formView}>
                        <Text style={theme.formViewLabel}>Property Address : </Text>
                        <Text style={theme.formVacantText}>{task.property_address}</Text>
                    </View>
                    <View style={theme.formView}>
                        <Text style={theme.formViewLabel}>Current Class : </Text>
                        <Text style={theme.formVacantText}>{task.current_class}</Text>
                    </View>
                    <View style={theme.formView}>
                        <Text style={theme.formViewLabel}>La Name : </Text>
                        <Text style={theme.formVacantText}>{task.la_name}</Text>
                    </View>
                    <View style={[theme.formView, { paddingBottom: 10 }]}>
                        <Text style={theme.formViewLabel}>State : </Text>
                        <Text style={theme.formVacantText}>{task.state}</Text>
                    </View>

                </View>
                <View style={{ margin: 10 }}>
                    <View>
                        <Input
                            placeholder="Actual Classfication"
                            onChangeText={(actual_classification) => this.setState({ actual_classification })}
                            value={this.state.actual_classification} />
                    </View>
                    <View>
                        <Input
                            placeholder="Meter Connected"
                            onChangeText={(meter_connected) => this.setState({ meter_connected })}
                            value={this.state.meter_connected} />
                    </View>
                    <View>
                        <Input
                            placeholder="Meter Number"
                            onChangeText={(meter_number) => this.setState({ meter_number })}
                            value={this.state.meter_number} />
                    </View>
                    <View>
                        <Input placeholder="Remarks" onChangeText={(remarks) => this.setState({ remarks })}
                            value={this.state.remarks} />
                    </View>
                    <View>
                        <CheckBox
                            iconRight
                            style={{ backgroundColor: '#fff' }}
                            right
                            title='Occupied'
                            checked={this.state.occupied}
                            onPress={() => this.setState({ occupied: !this.state.occupied })}
                        />
                    </View>


                    <View style={{ marginTop: 20 }}>
                        {this._camerapicker()}
                    </View>
                </View>
                <TouchableOpacity style={theme.fullBlock}
                    onPress={this._updateTask}>
                    <Text style={theme.fullBlockText}>UPDATE TASK</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    _camerapicker = () => {
        let picker = [];
        for (i = 0; i < 5; i++) {
            picker.push(
                <View key={i} style={{
                    flex: 1, flexDirection: 'row', justifyContent: 'space-between',
                    borderBottomColor: 'lightgray', borderBottomWidth: 1, paddingBottom: 5
                }}>
                    <View>
                        {this._showImage(this.state.showme, i)}
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this._pickimage()} >
                            <Text style={{ borderWidth: 1, padding: 20, margin: 10 }}>Image Picker</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        return picker
    }

    _showImage = (showme, key) => {
        if (showme == true) {
            if (this.state.image[key] != null) {
                return (
                    <View>
                        <Image
                            style={{ width: w, height: w, borderWidth: 1 }}
                            source={{ uri: this.state.image[key].path }} />
                    </View>
                )
            } else {
                return (
                    <View style={{
                        borderWidth: 1, width: w - 30, height: w - 30, borderColor: 'lightgray', marginTop: 5,
                        flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'
                    }}>
                        <Icon name="md-image" size={50} />
                    </View>
                )
            }
        } else {
            return (
                <View style={{
                    borderWidth: 1, width: w - 30, height: w - 30, borderColor: 'lightgray',
                    flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'
                }}>
                    <Icon name="md-image" size={50} />
                </View>
            )
        }
    }

    _pickimage = () => {
        ImagePicker.openCamera({
            multiple: true,
            width: 720,
            height: 720,
            cropping: true,
        }).then(image => {
            var nowImage = this.state.image
            nowImage.push(image[0])
            this.setState({
                showme: true,
                image: nowImage
            })
        }).catch((err) => err)
    }

    _updateTask = async () => {
        let User = await AsyncStorage.getItem('userToken');
        this.setState({
            userInfo: JSON.parse(User)
        })
        let perform_datetime = new Date().toJSON().toString().replace('T', ' ').replace('Z', '')
        let taskPerform = {
            id: parseInt(this.state.taskid),
            name: 'vacant_premise',
            seq_id: this.state.seq_id,
            taskdetail: this.state.taskData.taskdetail,
            taskperform: JSON.stringify({
                remarks: this.state.remarks,
                actual_classification: this.state.actual_classification,
                meter_connected: this.state.meter_connected,
                meter_number: this.state.meter_number,
                images: this.state.image
            }),
            status: 'done',
            datetime: perform_datetime,
            perform_sfatff: this.state.userInfo.info.id.toString()
        }

        updateTaskDone(taskPerform)
        this.props.navigation.navigate('VacantPremiseComplete')
    }

    componentDidMount() {
        let taskData = JSON.parse(this.state.taskData.taskperform)
        this.setState({
            image: taskData.images,
            remarks: taskData.remarks,
            actual_classification: taskData.actual_classification,
            meter_connected: taskData.meter_connected,
            meter_number: taskData.meter_number
        })
        // ImagePicker.clean().then(() => {
        //     console.log('removed all tmp images from tmp directory');
        // }).catch(e => {
        //     alert(e);
        // });
    }
}