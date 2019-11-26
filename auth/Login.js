import React, { Component } from 'react';
import { Button, View } from 'react-native';

import { getLogger } from '../core';

const log = getLogger('SignIn');

export class Login extends Component {
    static navigationOptions = {
        title: 'Please sign in',
    };

    handleSignIn = async () => {
        await new Promise(resolve =>
            setTimeout(resolve, 3000)
        );
        this.props.navigation.navigate('Products');
    };

    constructor(props) {
        super(props);
        log('constructor');
    }

    render() {
        log('render');
        return (
            <View>
                <Button title="Login" onPress={this.handleSignIn} />
            </View>
        );
    }

}
