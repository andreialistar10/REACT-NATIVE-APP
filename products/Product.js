import React from 'react';
import {Text} from 'react-native';

export default ({product = {}}) => {
    return (<Text>{product.name}</Text>)
};