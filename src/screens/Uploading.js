import React, { Component } from 'react'
import { View, Text, Platform, TouchableOpacity, Image } from 'react-native'
import theme from '../assets/theme'
import { queryAllCompletedTask, updateTaskDone, InsertNewLog } from '../database/allSchemas'
import Env from '../assets/config'
import futch from '../components/api'
import { TodayDate } from '../components/baseformat'

export default class UploadingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            showMe: false,
            total_task_to_upload: 0,
            total_upload_completed: 0,
            text_status: 'Uploading...',
            info_status: 'Please do not close this application while uploading process is active.'
        }
    }

    render() {
        return (
            <View style={theme.container}>
                <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../assets/images/logo.png')} style={{ width: 200 }} />
                    <View style={{ padding: 20, alignItems: 'center' }} >
                        <Text style={{ fontSize: 18 }}>{this.state.total_upload_completed}/{this.state.total_task_to_upload}</Text>
                        <Text style={{ fontSize: 24 }}>{this.state.text_status}</Text>
                        <Text style={{ fontSize: 18, textAlign: 'center' }}>{this.state.info_status}</Text>
                    </View>

                </View>
                <View>
                    {this._homeButton()}
                </View>

            </View>
        )
    }

    _homeButton = (showMe) => {
        if (this.state.showMe == true) {
            return (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}
                    style={[theme.fullBlock]} >
                    <View>
                        <Text style={theme.fullBlockText}>BACK TO MENU</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    async componentDidMount() {
        let total = await queryAllCompletedTask().then((completedTask) => {
            let count = 0
            Object.keys(completedTask).forEach((value, key) => {
                count = count + 1
                this._uploadData(completedTask[value])
            })
            return count
        })
        this.setState({
            total_task_to_upload: total
        })
    }

    _uploadData = data => {
        let form = new FormData();
        let taskPerform = JSON.parse(data.taskperform)
        let taskDetail = JSON.parse(data.taskdetail)
        let images = taskPerform.images

        form.append('task_detail', `${data.taskdetail}`)
        form.append('task_perform', `${data.taskperform}`)
        form.append('remarks', `${taskPerform.remarks}`)
        form.append('perform_staff', `${data.perform_staff}`)
        images.forEach((value, i) => {
            form.append(`image_${i}`, {
                uri: Platform.OS === "android" ? value.path : value.path.replace("file://", ""),
                type: value.mime,
                name: `${data.name}_${taskDetail.sewacc}_${i}.jpg`
            });
        })

        if (data.name != '') {
            console.log(form)
            // console.log(`${Env.BASE_URL}task/${data.name}`)
            futch(`${Env.BASE_URL}task/${data.name}`, {
                method: 'post',
                body: form
            }, (e) => {
                const progress = e.loaded / e.total;
                this.setState({
                    progress: progress
                });

                if (progress == 1) {
                    this.state.total_upload_completed += 1
                    let taskDone = {
                        id: parseInt(data.id),
                        taskperform: data.taskperform,
                        status: 'uploaded',
                    }
                    // console.log(taskDone)
                    updateTaskDone(taskDone)
                }

                if (this.state.total_task_to_upload == this.state.total_upload_completed) {
                    this.setState({
                        showMe: true,
                        text_status: 'Completed',
                        info_status: 'Uploading process is completed, Thank You.'
                    })
                }
            })
            //    .then((res) => 
            // console.log(res), 
            // (e) => console.log(e)
            // ) 

            // if (data.name != '') {
                // console.log(`${Env.BASE_URL}task/${data.name}`)
                // fetch(`${Env.BASE_URL}task/${data.name}`, {
                //     method: 'post',
                //     body: form
                // })
                //     .then((response) => {
                //         console.log(response)
                //         return response.json()
                //     })
                //     .then((responseJson) => {
                //         let taskDone = {
                //             id: parseInt(data.id),
                //             taskperform: data.taskperform,
                //             status:'uploaded',
                //         }
                //         console.log(taskDone)
                //         // updateTaskDone(taskDone)
                //     })
                //     .catch((error) => {
                //         console.error(error);
                //     });
            // }


        }

        let log = {
            key_name: 'task_uploaded',
            value: TodayDate()
        }
        InsertNewLog(log)
    }
}