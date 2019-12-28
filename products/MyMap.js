import { getLogger } from "../core";
import React from "react";
import { Text, View } from 'react-native';
import { ProductContext } from './ProductContext';

const log = getLogger('MyMap');

export const MyMap = () => {
    log('render');
    return (
        <ProductContext.Consumer>
            {() => (
                <View>
                    <Text>MyMap</Text>
                </View>
            )}
        </ProductContext.Consumer>
    )
};
