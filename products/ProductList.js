import React from 'react';
import {ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {getLogger, navService} from "../core";
import {ProductContext} from './ProductContext';
import Product from "./Product";

const log = getLogger('ProductList');

export const ProductList = () =>{
    log('render');
    return (
        <ProductContext.Consumer>
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
        </ProductContext.Consumer>
    );
};

ProductList.navigateOptions = {
    headerTitle: 'Product List',
    headerRight: (
        <Button
            onPress = {() => navService.navigate('ProductEdit')}
            title="Add"
        />
    )
};
