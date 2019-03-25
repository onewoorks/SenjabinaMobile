import React, { Component } from 'react'
import {
    View, Text, ScrollView, Modal, TouchableHighlight, Alert,
    TouchableOpacity, Image, Dimensions, AsyncStorage, Picker, TextInput
} from 'react-native'
import theme, { ThemeModal, Commercial } from '../../assets/theme'
import ImagePicker from 'react-native-image-crop-picker';
import { insertNewTaskDone, updateTaskList, updateTaskDone, InsertNewLog } from '../../database/allSchemas';
import { TodayDate } from '../../components/baseformat'
import { UPLOADED, COMPLETED, COMMERCIAL } from '../../assets/constant';
import ImageZoom from 'react-native-image-pan-zoom'
import Icon from 'react-native-vector-icons/Ionicons';

const w = ((Dimensions.get('window').width - 7) / 3)

export default class CommercialFormScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            zoomImage: 0,
            taskid: this.props.navigation.getParam('id'),
            taskData: this.props.navigation.getParam('data'),
            seq_id: this.props.navigation.getParam('seq_id'),
            form: this.props.navigation.getParam('form'),
            tab: this.props.navigation.getParam('tab'),
            image: [],
            showme: false,
            userInfo: null,
            form_info: {},
            save_button_label: (this.props.navigation.getParam('form') == 'new') ? 'SAVE TASK' : 'UPDATE TASK'
        }
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            title: 'Commercial : ' + state.params.title,
            headerStyle: {
                backgroundColor: '#4a69bd',
            },
            headerTintColor: 'white'
        };
    };

    render() {
        let task = JSON.parse(this.state.taskData.taskdetail)
        return (
            <ScrollView>
                {this._renderModal()}
                <View style={Commercial.formViewArea}>
                    <View style={theme.formView}>
                        <Text style={theme.formViewLabel}>Owner Name : </Text>
                        <Text style={theme.formVacantText}>{task.owner_1}</Text>
                        <Text style={[theme.formVacantText, (task.owner_2 == '') ? { display: 'none' } : { display: 'flex' }]}>
                            {task.owner_2}</Text>
                    </View>
                    <View style={theme.formView}>
                        <Text style={theme.formViewLabel}>Property Address : </Text>
                        <Text style={theme.formVacantText}>
                            {task.prop_address_1 +
                                ', ' + task.prop_address_2 +
                                ', ' + task.prop_address_3 +
                                ', ' + task.prop_address_4 +
                                ', ' + task.prop_address_5}
                        </Text>
                    </View>
                    <View style={[theme.formView, { paddingBottom: 10 }]}>
                        <Text style={theme.formViewLabel}>La Name & State : </Text>
                        <Text style={theme.formVacantText}>{task.la_name}, {task.state}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={[theme.formView, { flex: 0.5, paddingBottom: 10 }]}>
                            <Text style={theme.formViewLabel}>Balance as at : </Text>
                            <Text style={theme.formVacantText}>RM {task.balance_date}</Text>
                        </View>

                        <View style={[theme.formView, { flex: 0.5, paddingBottom: 10 }]}>
                            <Text style={theme.formViewLabel}>Balance as copy bill : </Text>
                            <Text style={theme.formVacantText}>RM {task.balance_as_bill}</Text>
                        </View>
                    </View>

                </View>
                <View>
                    <View style={{ padding: 10 }}>
                        <View>
                            <Text style={theme.inputLabel}>Occupier :</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.occupier == 'OWNER') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._occupier('OWNER')}>
                                <Text
                                    style={(this.state.form_info.occupier == 'OWNER') ? Commercial.pickedButtonSelectedText : ''}>OWNER</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Commercial.pickedButton,
                                (this.state.form_info.occupier == 'TENANT') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal]}
                                onPress={() => this._occupier('TENANT')}
                            >
                                <Text
                                    style={(this.state.form_info.occupier == 'TENANT') ? Commercial.pickedButtonSelectedText : ''}
                                >TENANT</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text style={theme.inputLabel}>Owner Name Correct :</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.owner_name_correct == 'Yes') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._ownernameCorrect('Yes')}
                            >
                                <Text
                                    style={(this.state.form_info.owner_name_correct == 'Yes') ? Commercial.pickedButtonSelectedText : ''}
                                >YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.owner_name_correct == 'No') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._ownernameCorrect('No')}
                            >
                                <Text
                                    style={(this.state.form_info.owner_name_correct == 'No') ? Commercial.pickedButtonSelectedText : ''}
                                >NO</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={(this.state.form_info.owner_name_correct == 'No') ? { display: 'flex' } : { display: 'none' }}>
                            <View>
                                <Text style={theme.inputLabel}>Please Specify Correct Name :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(correct_ownername) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.correct_ownername = correct_ownername
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.correct_ownername} />
                            </View>
                        </View>

                        <View style={
                            [
                                (this.state.form_info.occupier == 'OWNER') ? { display: 'flex' } : { display: 'none' }
                            ]}>
                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Owner Telephone No :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='phone-pad'
                                        onChangeText={(owner_tel_no) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.owner_tel_no = owner_tel_no
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.owner_tel_no} />
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Owner Mobile No :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='phone-pad'
                                        onChangeText={(owner_mobile_no) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.owner_mobile_no = owner_mobile_no
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.owner_mobile_no} />
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Owner Fax :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='phone-pad'
                                        onChangeText={(owner_fax) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.owner_fax = owner_fax
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.owner_fax} />
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Owner Email :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='email-address'
                                        onChangeText={(owner_email) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.owner_email = owner_email
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.owner_email} />
                                </View>
                            </View>

                        </View>

                        <View
                            style={
                                [
                                    (this.state.form_info.occupier == 'TENANT') ? { display: 'flex' } : { display: 'none' }
                                ]
                            }>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Tenant Name :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        onChangeText={(tenant_name) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.tenant_name = tenant_name
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.tenant_name} />
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Tenant Telphone No :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='numeric'
                                        onChangeText={(tenant_tel_no) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.tenant_tel_no = tenant_tel_no
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.tenant_tel_no} />
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Tenant Mobile No :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='numeric'
                                        onChangeText={(tenant_mobile_no) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.tenant_mobile_no = tenant_mobile_no
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.tenant_mobile_no} />
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text style={theme.inputLabel}>Tenant Fax :</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={theme.textInput}
                                        keyboardType='phone-pad'
                                        onChangeText={(tenant_fax) => this.setState((prevState) => {
                                            const formInfo = prevState.form_info
                                            formInfo.tenant_fax = tenant_fax
                                            return { ...formInfo }
                                        })}
                                        value={this.state.form_info.tenant_fax} />
                                </View>
                            </View>

                            <View>
                            </View>


                            <View>
                                <Text style={theme.inputLabel}>Tenant Email :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    keyboardType='email-address'
                                    onChangeText={(tenant_email) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.tenant_email = tenant_email
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.tenant_email} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Occupier Nationality :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(occupier_nationality) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.occupier_nationality = occupier_nationality
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.occupier_nationality} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>No of visit :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(no_of_visit) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.no_of_visit = no_of_visit
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.no_of_visit} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>No of Follow Up Call :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(no_of_followup_call) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.no_of_followup_call = no_of_followup_call
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.no_of_followup_call} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Property Usage :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(property_usage) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.property_usage = property_usage
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.property_usage} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Property Type :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(property_type) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.property_type = property_type
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.property_type} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Name of Shop/Company :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(name_of_shop_company) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.name_of_shop_company = name_of_shop_company
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.name_of_shop_company} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Nature Of Business :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(nature_of_business) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.nature_of_business = nature_of_business
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.nature_of_business} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>DR Code :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(dr_code) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.dr_code = dr_code
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.dr_code} />
                            </View>
                        </View>

                        <View>
                            <Text style={theme.inputLabel}>Black Area :</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.blackarea == 'Yes') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._blackArea('Yes')}
                            >
                                <Text
                                    style={(this.state.form_info.blackarea == 'Yes') ? Commercial.pickedButtonSelectedText : ''}
                                >YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.blackarea == 'No') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._blackArea('No')}
                            >
                                <Text
                                    style={(this.state.form_info.blackarea == 'No') ? Commercial.pickedButtonSelectedText : ''}
                                >NO</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text style={theme.inputLabel}>Highrise :</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.highrise == 'Yes') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._highrise('Yes')}
                            >
                                <Text
                                    style={(this.state.form_info.highrise == 'Yes') ? Commercial.pickedButtonSelectedText : ''}
                                >YES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    Commercial.pickedButton,
                                    (this.state.form_info.highrise == 'No') ? Commercial.pickedButtonSelected : Commercial.pickedButtonNormal
                                ]}
                                onPress={() => this._highrise('No')}
                            >
                                <Text
                                    style={(this.state.form_info.highrise == 'No') ? Commercial.pickedButtonSelectedText : ''}
                                >NO</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Reason Refuse To Pay :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(reason_refuse_to_pay) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.reason_refuse_to_pay = reason_refuse_to_pay
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.reason_refuse_to_pay} />
                            </View>
                        </View>

                        <View>
                            <View>
                                <Text style={theme.inputLabel}>Remarks :</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={theme.textInput}
                                    onChangeText={(remarks) => this.setState((prevState) => {
                                        const formInfo = prevState.form_info
                                        formInfo.remarks = remarks
                                        return { ...formInfo }
                                    })}
                                    value={this.state.form_info.remarks} />
                            </View>
                        </View>

                        <View>
                            <Text style={theme.inputLabel}>Image(s) :</Text>
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
                <TouchableOpacity style={Commercial.fullBlock}
                    onPress={this._submitForm}>
                    <Text style={theme.fullBlockText}>{this.state.save_button_label}</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

    _ownernameCorrect = (option) => {
        this.setState((prevState) => {
            const formInfo = prevState.form_info
            formInfo.owner_name_correct = option
            return { ...formInfo }
        })
    }

    _blackArea = (option) => {
        this.setState((prevState) => {
            const formInfo = prevState.form_info
            formInfo.blackarea = option
            return { ...formInfo }
        })
    }

    _highrise = (option) => {
        this.setState((prevState) => {
            const formInfo = prevState.form_info
            formInfo.highrise = option
            return { ...formInfo }
        })
    }

    _occupier = (option) => {
        this.setState((prevState) => {
            const formInfo = prevState.form_info
            formInfo.occupier = option
            return { ...formInfo }
        })
    }

    _camerapicker = () => {
        let picker = [];
        for (i = 0; i < 6; i++) {
            picker.push(
                <View key={i}>
                    <View style={{ width: w, padding: 3 }}>
                        {this._showImage(this.state.showme, i)}
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
                    <TouchableOpacity onPress={() => { this._selectImageOption(key) }}>
                        <Image
                            style={[{ width: w - 6, height: w - 6, },
                            ]}
                            source={{ uri: this.state.image[key].path }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>

                )
            } else {
                return (
                    <TouchableOpacity onPress={() => { this._selectImageOption(key) }}>
                        <Image
                            style={[{ width: w - 6, height: w - 6, }
                            ]}
                            source={require('../../assets/images/logo-bw.png')}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )
            }
        } else {
            return (
                <TouchableOpacity onPress={() => { this._selectImageOption(key) }}>
                    <Image
                        style={[{ width: w - 6, height: w - 6, },
                        ]}
                        source={require('../../assets/images/logo-bw.png')}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
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
                image: nowImage,
                modalVisible: false
            })
        }).catch((err) => console.log(err))
    }

    _submitForm = async () => {
        switch (this.state.form) {
            case 'new':
                this._newForm()
                break;
            case 'completed':
                this._updateForm()
                break;
        }
    }

    _selectImageOption = (imageKey) => {
        this.setModalVisible(true, imageKey);
    }
    
    setModalVisible(visible, imageKey) {
        this.setState({
            modalVisible: visible,
            zoomImage: imageKey
        });
    }

    _confirmDeleteImage = (key) => {
        Alert.alert(
            'Delete Image',
            'Are you sure to delete this image?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        this.state.image.splice(key, 1)
                        this.setState({
                            modalVisible: false
                        })
                    }
                },
            ],
            { cancelable: false },
        );
    }
    _newForm = async () => {
        let User = await AsyncStorage.getItem('userToken');
        this.setState({
            userInfo: JSON.parse(User)
        })
        let perform_datetime = new Date().toJSON().toString().replace('T', ' ').replace('Z', '')
        let taskPerform = {
            name: COMMERCIAL,
            seq_id: this.state.seq_id,
            taskdetail: this.state.taskData.taskdetail,
            taskperform: JSON.stringify({
                form_info: this.state.form_info,
                images: this.state.image,
            }),
            tab: this.state.tab,
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
        this.props.navigation.navigate('Commercial')
    }

    _updateForm = async () => {
        let User = await AsyncStorage.getItem('userToken');
        this.setState({
            userInfo: JSON.parse(User)
        })
        let perform_datetime = new Date().toJSON().toString().replace('T', ' ').replace('Z', '')
        let taskPerform = {
            id: parseInt(this.state.taskid),
            name: COMMERCIAL,
            seq_id: this.state.seq_id,
            taskdetail: this.state.taskData.taskdetail,
            taskperform: JSON.stringify({
                form_info: this.state.form_info,
                images: this.state.image,
            }),
            status: 'done',
            datetime: perform_datetime,
            perform_sfatff: this.state.userInfo.info.id.toString()
        }

        updateTaskDone(taskPerform)
        this.props.navigation.navigate('Commercial', {
            form: 'completed'
        })
    }
    _renderModal = () => {
        return (
            <Modal
                style={{ backgroundColor: 'red' }}
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    console.log('close')
                }
                }>
                <View style={[ThemeModal.background, { height: Dimensions.get('window').height }]}>
                    <View style={{ alignItems: 'flex-end', padding: 10 }}>
                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={ThemeModal.textlabel}>
                                <Icon name="md-close" size={32} />
                            </Text>
                        </TouchableHighlight>
                    </View>
                    <View>
                        {this._showImageToZoom(true, this.state.zoomImage)}
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        alignContent: 'space-around',
                        padding: 10,
                        backgroundColor: '#000'
                    }}>

                        <View>
                            <TouchableOpacity onPress={() => this._pickimage()}>
                                <Text style={ThemeModal.textlabel}>
                                    <Icon name="md-camera" size={34} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this._albumPicker()}>
                                <Text style={ThemeModal.textlabel}>
                                    <Icon name="md-image" size={34} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this._confirmDeleteImage(this.state.zoomImage)}>
                                <Text style={ThemeModal.textlabel}>
                                    <Icon name="md-trash" size={34} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    _showImageToZoom = (showme, key) => {
        if (showme == true) {
            if (this.state.image[this.state.zoomImage] != null) {
                return (
                    <ImageZoom
                        cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').height - 130}
                        imageWidth={Dimensions.get('window').width}
                        imageHeight={Dimensions.get('window').width}>
                        <Image style={
                            {
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').width
                            }}
                            source={{ uri: this.state.image[this.state.zoomImage].path }} />
                    </ImageZoom>
                )
            } else {
                return (
                    <View
                        style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height - 120,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Image
                            source={require('../../assets/images/logo-bw.png')}
                            resizeMode="cover"
                        />
                    </View>

                )
            }
        } else {
            return (
                <View
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height - 120,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Image
                        source={require('../../assets/images/logo-bw.png')}
                        resizeMode="cover"
                    />
                </View>
            )
        }
    }

    _albumPicker = () => {
        ImagePicker.openPicker({
            width: 720,
            height: 720,
            cropping: true
        }).then(image => {
            var nowImage = this.state.image
            nowImage.push(image)
            this.setState({
                showme: true,
                image: nowImage,
                modalVisible: false
            })
        }).catch((err) => console.log(err))
    }
    async componentDidMount() {
        switch (this.state.form) {
            case 'new':
                let task = JSON.parse(this.state.taskData.taskdetail)
                this.setState({
                    form_info: {
                        occupier: 'OWNER',
                        owner_name_correct: 'Yes',
                        blackarea: 'No',
                        highrise: 'No'
                    }
                })
                break;
            case UPLOADED:
            case COMPLETED:
                let taskData = JSON.parse(this.state.taskData.taskperform)
                this.setState({
                    image: taskData.images,
                    form_info: taskData.form_info,
                    showme: true,
                })
                break;
            case 'uploaded':
                break;
        }
    }
}