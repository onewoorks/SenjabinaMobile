import React, { Component } from 'react'
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import { updateTaskList, deleteTaskList, queryAllTaskList, insertNewTaskList, deletAllTaskList } from '../database/allSchemas'

let Listing = props => {
    let view = [];
    let items = props.items
    Object.keys(items).map((value, index) => {
        let taskdetail = JSON.parse(items[value].taskdetail)
        view.push(
            <View key={index}>
                <Text>Listing {taskdetail.job_no}</Text>
            </View>
        )
    })
    return (<View>{view}</View>)
}

export default class TaskListData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskList: {}
        }
    }

    reloadData = () => {
        queryAllTaskList().then((taskList) => {
            this.setState({
                taskList: taskList
            })
        }).catch((error) => {
            this.setState({
                taskList: {}
            })
        })
    }

    pressme = () => {
        let taskDetail = {
            job_no: '12313',
            remark: 'no remark'
        }
        let taskList = {
            id: 2,
            name: '1234ABC',
            taskdetail: JSON.stringify(taskDetail)
        }
        insertNewTaskList(taskList)
        alert('Data Added')
        this.reloadData()
    }

    deleteAll = () => {
        deletAllTaskList().then(() => {
            console.log('data has been deleted')
            this.setState({
                taskList: {}
            })
        }).catch((error)=>{
            console.log('error')
        })

        alert('data deleted!')
    }

    componentDidMount() {
        this.reloadData()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Database Realm</Text>
                <TouchableOpacity onPress={() => this.pressme()} >
                    <Text>Press Me</Text>
                </TouchableOpacity>
                <Button onPress={() => this.reloadData()} title='Reload' />
                <Listing items={this.state.taskList} />

                <Button onPress={() => this.deleteAll()} title='Delete All Data' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    }
})