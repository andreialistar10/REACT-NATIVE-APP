import React, { useEffect } from 'react';
import {ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {getLogger, navService, setToken, buildHeaders, httpApiUrl} from "../core";
import {ProductContext} from './ProductContext';
import Product from "./Product";
import { Client } from '@stomp/stompjs';
import * as encoding from 'text-encoding';

var SockJS = require('sockjs-client/dist/sockjs.js');

const log = getLogger('ProductList');

export const ProductList = () =>{
    log('render');
    useEffect(() =>{
        log('onConnected');
        let client = new Client();
        client.configure({
            // brokerURL: `${httpApiUrl}/ws`,
            // connectHeaders: buildHeaders(),
            appendMissingNULLonIncoming: true,
            logRawCommunication: true,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () =>{
                // return SockJS(`${httpApiUrl}/ws`);
                return SockJS();
            },
            beforeConnect: () =>{
                log("trying to connect");
            },
            onStompError: () =>{
              log("ERRORRRRR");
            },
            onWebSocketError: () =>{
                log("WSS ERRRORRRR");
            },
            onConnect: () => {
                console.log("AICI");
                log('onConnect');

                client.subscribe('/topic/messages', message => {
                    log(message.body);
                    // this.setState({serverTime: message.body});
                });
            },
            // Helps during debugging, remove in production
            debug: (str) => {
                console.log(new Date(), str);
            }
        });
        client.activate();
        return () => {
            client.deactivate();
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
