import React, { Component } from 'react'
import { AsyncStorage, View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import theme from '../assets/theme'
import Env from '../assets/config'
import { queryAllTaskList, insertNewTaskList, deletAllTaskList, queryAllCompletedTask } from '../database/allSchemas'
import Icon from 'react-native-vector-icons/Ionicons';

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
      totalNewTaskFetch: 0,
      userInfo: null,
      buttonLoadServerLabel: 'LOAD TASK FROM SERVER'
    }
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
            </View>
          </ImageBackground>
        </View>


        <View style={{ flex: 1, alignItems: 'center', alignContent: 'center', justifyContent: 'space-around' }}>
          <View style={{}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Task')}>
              <Text style={theme.homeNumber}>{this.state.totalTask}</Text>
              <Text style={theme.homeTaskText}>TASK ASSIGNED</Text>
            </TouchableOpacity>
          </View>
          <View >
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Task')}>
              <Text style={theme.homeNumber}>{this.state.totalCompletedTask}</Text>
              <Text style={theme.homeTaskText}>TASK COMPLETED</Text>
            </TouchableOpacity>
          </View>

        </View>



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
          <View style={{ flex: 0.2, height: 60, backgroundColor: '#eb2f06', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={this._deleteAllTask}>
              <Text style={theme.fullBlockText}>DELETE LOCAL DATA</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  _deleteAllTask = () => {
    deletAllTaskList().then(() => {
      console.log('data deleted')
      this._loadTask();
    })
  }

  _fetchTask = async () => {
    let user = await AsyncStorage.getItem('userToken')
    let userInfo = JSON.parse(user)
    this.setState({
      buttonLoadServerLabel: 'DOWNLOAD INFORMATION'
    })
    fetch(Env.BASE_URL + 'task/my-task?id=' + userInfo.info.id)
      .then((response) => response.json())
      .then((responseJson) => {
        let totalData = Object.keys(responseJson.response).length
        this.setState({
          totalTask: totalData,
          vacantPremiseTask: responseJson.response
        }, function () {
          this.state.vacantPremiseTask.forEach((value, key) => {
            let taskData = {
              name: 'vacant_premise',
              seq_id: value.seq_id,
              taskdetail: JSON.stringify(value),
              status: '',
              perform_datetime: ''
            }
            insertNewTaskList(taskData)
            this.setState({
              buttonLoadServerLabel: 'COMPLETED'
            })
          });
        });

      })
      .catch((error) => {
        console.error(error);
      });
  }

  _retrieveData = async () => {
    let User = await AsyncStorage.getItem('userToken');
    this.setState({
      userInfo: JSON.parse(User)
    })
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleLogout: this._signOutAsync })
    this._retrieveData();
    this._loadTask()
  }

  _loadTask = () => {
    queryAllTaskList()
      .then((taskList) => {
        this.setState({
          totalTask: taskList.length
        })
      })
      .catch((error) => {
        console.log(error)
      })

    queryAllCompletedTask()
      .then((completedTask) => {
        this.setState({
          totalCompletedTask: completedTask.length
        })
      }).catch((error) => {
        console.log(error)
      })
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}