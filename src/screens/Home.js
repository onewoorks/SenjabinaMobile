import React, { Component } from 'react'
import {
  AsyncStorage, View, Text, TouchableOpacity, ImageBackground, Alert, Dimensions, ScrollView
} from 'react-native'
import theme, { ThemeBase } from '../assets/theme'
import Env from '../assets/config'
import {
  queryAllTaskList,
  insertNewTaskList,
  deletAllTaskList,
  queryAllCompletedTask,
  deletAllTaskCompletedTask,
  taskUploaded,
  InsertNewLog,
  GetLastDataLog,
  DeleteAllLogs,
  QueryTaskList
} from '../database/allSchemas' 
import { TodayDate, FormatDate } from '../components/baseformat'
import Icon from 'react-native-vector-icons/Ionicons';
import { COMMERCIAL } from '../assets/constant';

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return (
      {
        title: '',
        headerTransparent: true,
        headerRight: (
          <Icon
            name="md-log-out"
            onPress={() => navigation.state.params.handleLogout()}
            size={30}
            style={{ marginRight: 10, color: '#fff' }} />
        )
      }
    )
  };

  constructor(props) {
    super(props)
    this.state = {
      totalTask: 0,
      totalCompletedTask: 0,
      totalOpenTask: 0,
      totalNewTaskFetch: 0,
      totalUploaded: 0,
      userInfo: null,
      buttonLoadServerLabel: 'LOAD TASK FROM SERVER',
      lastDownloaded: 'none',
      lastUploaded: 'none',
      lastPerformed: 'none'
    }
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
      this._loadTask()
    });
  }

  render() {
    return (
      <View style={{
        flex: 1, flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        <View>
          <ImageBackground source={require('../assets/images/loginBg.jpg')} style={{ width: '100%', height: 280 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{(this.state.userInfo) ? this.state.userInfo.info.full_name : ''}</Text>
              <Text style={{ fontSize:13, fontStyle:'italic', color:'#fff'}}>Version 1.0.1</Text>
            </View>
          </ImageBackground>
        </View>


        <ScrollView >
          <View style={ThemeBase.bottomLine}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Task',{
              form:'new', title:'New'
            })}>
              <Text style={theme.homeNumber}>{this.state.totalOpenTask}</Text>
              <Text style={theme.homeTaskText}>TASK ASSIGNED ({this.state.totalTask}) </Text>
              <Text style={theme.infoLabel}>Last sync : {this.state.lastDownloaded}</Text>
            </TouchableOpacity>
          </View>
          <View style={ThemeBase.bottomLine}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Task', {
              form: 'completed',
              title: 'Completed'
            })}>
              <Text style={theme.homeNumber}>{this.state.totalCompletedTask}</Text>
              <Text style={theme.homeTaskText}>TASK COMPLETED</Text>
              <Text style={theme.infoLabel}>Last sync : {this.state.lastPerformed}</Text>
            </TouchableOpacity>
          </View>

          <View style={ThemeBase.bottomLine}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Task',{
              form: 'uploaded',
              title:'Uploaded'
            })}>
              <Text style={theme.homeNumber}>{this.state.totalUploaded}</Text>
              <Text style={theme.homeTaskText}>TOTAL UPLOADED.</Text>
              <Text style={theme.infoLabel}> Last sync : {this.state.lastUploaded} </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          alignContent: 'space-around',
        }}>
          <View style={{ flex: 0.8, height: 60, backgroundColor: '#079992', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={this._fetchTask}>
              <Text style={theme.fullBlockText}>
                <Icon name="md-cloud-download" size={24} /> {this.state.buttonLoadServerLabel}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.2, height: 60, backgroundColor: '#eb2f06', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={this._deleteAllTask}>
              <Text style={theme.fullBlockText}>
                <Icon name="md-trash" size={24} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  _deleteAllTask = () => {
    Alert.alert("Data has been cleared!")
    // DeleteAllLogs()
    deletAllTaskList().then(() => {
      this._loadTask();
    })
    // deletAllTaskCompletedTask().then(() => {
    //   this._loadTask();
    // })
    // ImagePicker.clean().then(() => {
    //   console.log('removed all tmp images from tmp directory');
    // }).catch(e => {
    //   alert(e);
    // });
    this.setState({
      lastDownloaded: 'none',
      // lastUploaded: 'none',
      // lastPerformed: 'none'
    })
  }

  _fetchTask = async () => {
    let user = await AsyncStorage.getItem('userToken')
    Alert.alert("Data has been fetched!")
    let userInfo = JSON.parse(user)
    this.setState({
      buttonLoadServerLabel: 'DOWNLOAD INFORMATION',
      userInfo: userInfo
    })
    fetch(Env.BASE_URL + 'task/my-task?id=' + userInfo.info.id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          totalTask: responseJson.response.total_task,
          totalOpenTask: responseJson.response.total_task,
          vacantPremiseTask: responseJson.response.vacant_premises,
          nonCommercialTask: responseJson.response.non_commercial,
          commercialTask: responseJson.response.commercial,
          tariffConfirmationTask: responseJson.response.tariff_confirmation
        }, function () {
          this.__VacantPremises(this.state.vacantPremiseTask)
          this.__NonCommercial(this.state.nonCommercialTask)
          this.__Commercial(this.state.commercialTask)
          this.__TariffConfirmation(this.state.tariffConfirmationTask)
        });

      })
      .catch((error) => {
        console.error(error);
      });

    let log = {
      key_name: 'task_downloaded',
      value: TodayDate()
    }
    InsertNewLog(log)
    this._retrieveData()
  }

  _checkTaskExist = async (fetchTaskData) => {
    let exist = await QueryTaskList(fetchTaskData)
    if (!exist) {
      insertNewTaskList(fetchTaskData)
    }

  }

  _retrieveData = async () => {
    let User = await AsyncStorage.getItem('userToken')
    let downloadLog = await GetLastDataLog('task_downloaded')
    let uploadLog = await GetLastDataLog('task_uploaded')
    let performLog = await GetLastDataLog('task_completed')
    this.setState({
      userInfo: JSON.parse(User),
      lastDownloaded: (downloadLog) ? FormatDate(downloadLog.value) : this.state.lastDownloaded,
      lastUploaded: (uploadLog) ? FormatDate(uploadLog.value) : this.state.lastUploaded,
      lastPerformed: (performLog) ? FormatDate(performLog.value) : this.state.performLog,
    })
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleLogout: this._signOutAsync })
    this._retrieveData();
    this._loadTask()
  }

  _loadTask = async () => {
    this._retrieveData()
    await queryAllTaskList()
      .then((taskList) => {
        this.setState({
          totalTask: taskList.length,
          totalOpenTask: taskList.length
        })
      })
      .catch((error) => {
        console.log(error)
      })

    await queryAllCompletedTask()
      .then((completedTask) => {
        this.setState({
          totalCompletedTask: completedTask.length,
        })
      }).catch((error) => {
        console.log(error)
      })

    await taskUploaded().then((uploaded) => {
      this.setState({
        totalUploaded: uploaded.length,
        totalOpenTask: this.state.totalTask - this.state.totalCompletedTask - uploaded.length
      })
    })
    await this.__positiveNumber()
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  __VacantPremises = (vacant_premises_task) => {
    vacant_premises_task.forEach((value, key) => {
            let taskData = {
              name: 'vacant_premise',
              seq_id: value.seq_id,
              tab: value.la_name,
              taskdetail: JSON.stringify(value),
              status: '',
              perform_datetime: '',
              perform_staff: this.state.userInfo.info.id
            }
            this._checkTaskExist(taskData)
          })
  }

  __NonCommercial = (non_commercial_task) => {
    non_commercial_task.forEach((value, key) => {
            let taskData = {
              name: 'non_commercial',
              seq_id: value.seq_id,
              tab: value.tabs_name,
              taskdetail: value.upload_content,
              status: '',
              perform_datetime: '',
              perform_staff: this.state.userInfo.info.id
            }
            this._checkTaskExist(taskData)
          })
  }

  __Commercial = (commercial_task) => {
    commercial_task.forEach((value, key) => {
      let taskData = {
        name: COMMERCIAL,
        seq_id: value.seq_id,
        tab: value.tabs_name,
        taskdetail: value.upload_content,
        status: '',
        perform_datetime: '',
        perform_staff: this.state.userInfo.info.id
      }
      this._checkTaskExist(taskData)
    })
  }

  __TariffConfirmation = (tariff_confirmation_task)=> {
    console.log(tariff_confirmation_task)
  }

  __positiveNumber = () => {
    let pos_number = this.state.totalOpenTask
    let final_number = 0
    if(pos_number > 0){
      final_number = pos_number 
    }
    this.setState({
      totalOpenTask: final_number
    })
  }
}