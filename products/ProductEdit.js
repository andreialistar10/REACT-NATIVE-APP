import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {getLogger} from "../core";

const log = getLogger('ItemEdit');

export class ProductEdit extends Component{

    static navigationOptions = {
        title: 'Product Edit',
    };

    constructor(props){
        super(props);
        log('constructor');
    }

    render(){
        log('render');
        return(
            <View>
                <Text>Product Edit</Text>
            </View>
        )
    }
}