import React, { useEffect, useContext } from 'react';
import {ActivityIndicator, FlatList, Text, View, Button, StyleSheet} from 'react-native';
import {openWebSocket, closeWebSocket, getLogger, navService, isConnectedToWifi} from "../core";
import {ProductContext} from './ProductContext';
import Product from "./Product";

const log = getLogger('ProductList');

export const ProductList = () =>{
    log('render');
    const { addNewProduct, updateProduct, logout, getAllProductsFromLocalStorage } = useContext(ProductContext);
    useEffect(() =>{

        isConnectedToWifi()
            .then((value) => {
                if (value) {
                    log('ONLINE SUPPORT');
                    openWebSocket(addNewProduct, updateProduct);
                }
                else {
                    log('OFFLINE SUPPORT');
                    closeWebSocket();
                    getAllProductsFromLocalStorage();
                }
            });

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
                            logout().then(() =>{
                                navService.navigate('AuthLoading');
                            });
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
        <View style={styles.container}>
            <Button
                onPress = {() => navService.navigate('mapView')}
                title="My Location"
            />
            <Button
                onPress = {() => navService.navigate('productEdit')}
                title="Add"
            />
        </View>
    ),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
