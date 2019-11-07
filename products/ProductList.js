import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getLogger} from "../core";

const log = getLogger('ProductList');

export class ProductList extends Component {

    constructor(props) {
        super(props);
        log('constructor')
    }

    componentDidMount() {
        log('componentDidMount');
    }

    componentWillUnmount() {
        log('componentWillUnmount');
    }

    render() {
        log('render');
        return (
            <View style={styles.container}>
                <Text>Product List</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
});
