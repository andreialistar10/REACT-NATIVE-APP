import React from 'react';
import {Text} from 'react-native';
import {getLogger} from "../core";

const log = getLogger("Product");

export default ({product = {}}) => {
    log('render');
    return (<Text>{product.name}</Text>)
};