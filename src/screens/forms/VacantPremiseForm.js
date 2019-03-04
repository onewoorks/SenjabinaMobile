import React, { Component } from 'react'
import {
    View, Text, ScrollView,
    TouchableOpacity, Image, Dimensions, AsyncStorage, Picker, TextInput
} from 'react-native'
import theme from '../../assets/theme'
import ImagePicker from 'react-native-image-crop-picker';
import { insertNewTaskDone, updateTaskList, updateTaskDone, InsertNewLog } from '../../database/allSchemas';
import { TodayDate } from '../../components/baseformat'
import { VACANT_PREMISE } from '../../assets/constant';

const w = ((Dimensions.get('window').width - 7) / 3)

export default class VacantPremiseForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskid: this.props.navigation.getParam('id'),
            taskData: this.props.navigation.getParam('data'),
            seq_id: this.props.navigation.getParam('seq_id'),
            form: this.props.navigation.getParam('form'),
            sewacc: '',
            image: [],
            showme: false,
            remarks: '',
            meter_number: '',
            meter_connected: 'Yes',
            actual_classification: '',
            occupied: true,
            userInfo: null,
            vacant_status: 'Vacant',
            tab: '',
            save_button_label: (this.props.navigation.getParam('form') == 'new') ? 'SAVE TASK' : 'UPDATE TASK'
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
                    <View style={[theme.formView, { paddingBottom: 10 }]}>
                        <Text style={theme.formViewLabel}>La Name & State : </Text>
                        <Text style={theme.formVacantText}>{task.la_name}, {task.state}</Text>
                    </View>
                </View>
                <View>
                    <View style={{ padding: 10 }}>
                        <View>
                            <Text style={theme.inputLabel}>Actual Classification :</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[
                                    theme.pickedButton,
                                    (this.state.actual_classification == 'DOMESTIC') ? theme.pickedButtonSelected : theme.pickedButtonNormal
                                ]}
                                onPress={() => this._actualClassification('DOMESTIC')}>
                                <Text
                                    style={(this.state.actual_classification == 'DOMESTIC') ? theme.pickedButtonSelectedText : ''}>DOMESTIC</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[theme.pickedButton,
                                (this.state.actual_classification == 'COMMERCIAL') ? theme.pickedButtonSelected : theme.pickedButtonNormal]}
                                onPress={() => this._actualClassification('COMMERCIAL')}
                            >
                                <Text
                                    style={(this.state.actual_classification == 'COMMERCIAL') ? theme.pickedButtonSelectedText : ''}
                                >COMMERCIAL</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text style={theme.inputLabel}>Meter Connected :</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                style={[
                                    theme.pickedButton,
                                    (this.state.meter_connected == 'Yes') ? theme.pickedButtonSelected : theme.pickedButtonNormal
                                ]}
                                onPress={() => this._meterConnected('Yes')}
                            >
                                <Text
                                    style={(this.state.meter_connected == 'Yes') ? theme.pickedButtonSelectedText : ''}
                                >YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    theme.pickedButton,
                                    (this.state.meter_connected == 'No') ? theme.pickedButtonSelected : theme.pickedButtonNormal
                                ]}
                                onPress={() => this._meterConnected('No')}
                            >
                                <Text
                                    style={(this.state.meter_connected == 'No') ? theme.pickedButtonSelectedText : ''}
                                >NO</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={(this.state.meter_connected == 'No') ? { display: 'none' } : { display: 'flex' }}>
                            <View>
                                <Text style={theme.inputLabel}>Meter Number :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    keyboardType='default'
                                    onChangeText={(meter_number) => this.setState({ meter_number })}
                                    value={this.state.meter_number} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Remarks :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(remarks) => this.setState({ remarks })}
                                    value={this.state.remarks} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Premis Status :</Text>
                            </View>
                            <View>
                                <Picker
                                    selectedValue={this.state.vacant_status}
                                    itemStyle={{ fontSize: 36, color: '#b43120' }}
                                    style={[{ height: 50, width: Dimensions.get('window').width }]}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ vacant_status: itemValue })
                                    }>
                                    <Picker.Item label="Vacant" value="Vacant" />
                                    <Picker.Item label="Occupied" value="Occupied" />
                                    <Picker.Item label="Burnt" value="Burnt" />
                                    <Picker.Item label="Abandoned" value="Abandoned" />
                                    <Picker.Item label="Demolish" value="Demolish" />
                                    <Picker.Item label="Used For Bird Nesting" value="Used For Bird Nesting" />
                                    <Picker.Item label="Vacant Land" value="Vacant Land" />
                                    <Picker.Item label="Under Renovation" value="Under Renovation" />
                                </Picker>
                            </View>
                        </View>

                        <View>
                            <Text style={theme.inputLabel}>Premise Image(s) :</Text>
                        </View>

                    </View>

                    <View style={{ padding: 3 }}>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap', alignItems: 'flex-start',
                            alignContent: 'flex-start'
                        }}>
                            {this._camerapicker()}
                        </View>
                    </View>

                </View>
                <TouchableOpacity style={theme.fullBlock}
                    onPress={this._submitForm}>
                    <Text style={theme.fullBlockText}>{this.state.save_button_label}</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    _meterConnected = (option) => {
        this.setState({
            meter_connected: option,
        })
    }

    _actualClassification = (option) => {
        this.setState({
            actual_classification: option
        })
    }

    _camerapicker = () => {
        let picker = [];
        for (i = 0; i < 5; i++) {
            picker.push(
                <TouchableOpacity key={i} onPress={() => this._pickimage()}
                    style={{ width: w, padding: 3 }}
                >
                    <View>
                        {this._showImage(this.state.showme, i)}
                    </View>
                </TouchableOpacity>
            )
        }
        return picker
    }

    _showImage = (showme, key) => {
        if (showme == true) {
            if (this.state.image[key] != null) {
                return (
                    <Image
                        style={[{ width: w - 6, height: w - 6, },
                        ]}
                        source={{ uri: this.state.image[key].path }}
                        resizeMode="cover"
                    />
                )
            } else {
                return (
                    <Image
                        style={[{ width: w - 6, height: w - 6, },
                        ]}
                        source={require('../../assets/images/chair.jpg')}
                        resizeMode="cover"
                    />
                )
            }
        } else {
            return (
                <Image
                    style={[{ width: w - 6, height: w - 6, },
                    ]}
                    source={require('../../assets/images/chair.jpg')}
                    resizeMode="cover"
                />
            )
        }
    }

    _albumPicker = () => {
        ImagePicker.openPicker({
            width: 720,
            height: 720,
            cropping: true
          }).then(image => {
            console.log(image);
          });
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
        }).catch((err) => console.log(err))
    }

    _submitForm = async () => {
        switch (this.state.form) {
            case 'new':
                this._newForm()
                break;
            case 'uploaded':
                this._updateForm()
            case 'completed':
                this._updateForm()
                break;
        }
    }

    _newForm = async () => {
        let User = await AsyncStorage.getItem('userToken');
        this.setState({
            userInfo: JSON.parse(User)
        })
        let perform_datetime = new Date().toJSON().toString().replace('T', ' ').replace('Z', '')
        let taskPerform = {
            name: VACANT_PREMISE,
            seq_id: this.state.seq_id,
            taskdetail: this.state.taskData.taskdetail,
            taskperform: JSON.stringify({
                remarks: this.state.remarks,
                actual_classification: this.state.actual_classification,
                meter_connected: this.state.meter_connected,
                meter_number: this.state.meter_number,
                vacant_status: this.state.vacant_status,
                perform_date: perform_datetime,
                images: this.state.image,
            }),
            tab: this.state.tab ,
            status: '',
            datetime: perform_datetime,
            perform_staff: this.state.userInfo.info.id.toString(),
        }
        let updateTask = {
            id: parseInt(this.state.taskid),
            status: 'done',
            datetime: perform_datetime,
            perform_staff: this.state.userInfo.info.id.toString()
        }

        insertNewTaskDone(taskPerform)
        updateTaskList(updateTask)
        let log = {
            key_name: 'task_completed',
            value: TodayDate()
          }
        InsertNewLog(log)
        this.props.navigation.navigate('VacantPremise')
    }

    _updateForm = async () => {
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
                images: this.state.image,
                vacant_status: this.state.vacant_status
            }),
            status: 'done',
            datetime: perform_datetime,
            perform_sfatff: this.state.userInfo.info.id.toString()
        }

        updateTaskDone(taskPerform)
        this.props.navigation.navigate('VacantPremise',{
            form : 'completed'
        })
    }

    async componentDidMount() {
        switch (this.state.form) {
            case 'new':
                let task = JSON.parse(this.state.taskData.taskdetail)
                this.setState({ 
                    actual_classification: task.current_class,
                    tab: this.state.taskData.tab
                 })
                break;
            case 'uploaded':
            case 'completed':
                let taskData = JSON.parse(this.state.taskData.taskperform)
                this.setState({
                    image: taskData.images,
                    remarks: taskData.remarks,
                    actual_classification: taskData.actual_classification,
                    meter_connected: taskData.meter_connected,
                    meter_number: taskData.meter_number,
                    showme: true,
                    vacant_status: taskData.vacant_status
                })
                break;
        }
    }
}