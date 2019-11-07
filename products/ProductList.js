import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {getLogger} from "../core";
import Product from "./Product";
import {Consumer} from './context';

const log = getLogger('ProductList');

export class ProductList extends Component {

    constructor(props) {
        super(props);
        log('constructor');
    }

    render() {
        return (
            <Consumer>
                {({isLoading, loadingError, products}) => (
                    <View style={styles.container}>
                        <ActivityIndicator animating={isLoading} size="large"/>
                        {loadingError && <Text> {loadingError.message || 'Loading error'}</Text>}
                        {products && products.map(product => <Product key={product.id} product={product}/>)}
                    </View>
                )}
            </Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
});
