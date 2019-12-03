import React, { useEffect, useState } from 'react';
import {ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {openWebSocket, closeWebSocket, getLogger, navService, setToken} from "../core";
import {ProductContext} from './ProductContext';
import Product from "./Product";

const log = getLogger('ProductList');

export const ProductList = () =>{
    log('render');
    // const { connectToWebSocket, disconnectFromWebSocket } = useContext(ProductContext);
    useEffect(() =>{
        openWebSocket();
        return () => {
            closeWebSocket();
        }
    });
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
                    <Button
                        onPress={() => {
                            setToken(null);
                            navService.navigate('AuthLoading');
                        }}
                        title="Logout"
                    />
                </View>
            )}
        </ProductContext.Consumer>
    );
};

ProductList.navigationOptions = () => ({
    headerTitle: 'Product List',
    headerRight: (
        <Button
            onPress = {() => navService.navigate('productEdit')}
            title="Add"
        />
    )
});
