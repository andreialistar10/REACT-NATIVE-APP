import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { getLogger } from '../core';

const log = getLogger('SignIn');

export class AuthLoading extends Component {
    componentDidMount() {
        log('didMount');
        this.fetchToken();
    }

    fetchToken = async () => {
        log('fetchToken...');
        const response = await new Promise(resolve =>
            setTimeout(resolve, 3000)
        );
        log('fetchToken succeeded');
        this.props.navigation.navigate(response ? 'Todo' : 'Auth');
    };

    render() {
        log('render');
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
