import React, { Component } from 'react'
import { View, Text, Platform, TouchableOpacity } from 'react-native'
import theme from '../assets/theme'
import { queryAllCompletedTask, updateTaskDone } from '../database/allSchemas'
import Env from '../assets/config'

export default class UploadingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null
        };
    };

    constructor(props){
        super(props)
        this.state = {
            showMe: false
        }
    }

    render() {
        return (
            <View style={[theme.container, { backgroundColor: '#78e08f' }]}>
                <Text>Uploading...</Text>
                <Text>Please Wait</Text>
                { this._homeButton() }
            </View>
        )
    }

    _homeButton = (showMe) => {
        if(this.state.showMe == true){
            return(
                <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home') } >
                        <Text>Back To Home</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    async componentDidMount() {
        await queryAllCompletedTask().then((completedTask) => {
            Object.keys(completedTask).forEach((value, key) => {
                this._uploadData(completedTask[value])
                // console.log(completedTask[value])
            })
            this.setState({
                showMe: true
            })

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
        images.forEach((value, i) => {
            form.append(`image_${i}`, {
                uri: Platform.OS === "android" ? value.path : value.path.replace("file://", ""),
                type: value.mime,
                name: `${data.name}_${taskDetail.sewacc}_${i}.jpg`
            });
        })
        
        if (data.name != '') {
            fetch(`${Env.BASE_URL}task/${data.name}`, {
                method: 'post',
                body: form
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    let taskDone = {
                        id: parseInt(data.id),
                        taskperform: data.taskperform,
                        status:'uploaded'
                    }
                    updateTaskDone(taskDone)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
}