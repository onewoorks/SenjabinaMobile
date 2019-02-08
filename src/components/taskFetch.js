import React, { Component } from 'react'
import { View, Text } from 'react-native'

export default class TaskFetch extends Component {

    render() {
        console.log('on in');
        fetch('http://localhost/senjabina/api/task/my-task?id=1')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }
}