import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {getLogger} from "../core";
import {Consumer} from './context';
import Product from "./Product";

const log = getLogger('ProductList');

export class ProductList extends Component {

    constructor(props) {
        super(props);
        log('constructor');
    }

    render() {
        log('render');
        return (
            <Consumer>
                {({isLoading, loadingError, products}) => (
                    <View>
                        <ActivityIndicator animating={isLoading} size="large"/>
                        {loadingError && <Text> {loadingError.message || 'Loading error'}</Text>}
                        {products &&
                        <FlatList
                            data={products.map(product => ({ ...product, key: String(product.id) }))}
                            renderItem={({ item }) => <Product product={item}/>}
                        />}
                    </View>
                )}
            </Consumer>
        );
    }
}
