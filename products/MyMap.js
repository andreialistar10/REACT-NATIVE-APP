import { getLogger } from "../core";
import React from "react";
import { View, StyleSheet } from 'react-native';
import { ProductContext } from './ProductContext';
import MapView from 'react-native-maps';

const log = getLogger('MyMap');

export const MyMap = () => {
    log('render');
    return (
        <ProductContext.Consumer>
            {() => (
                <View style ={styles.container}>
                    <MapView
                        style={styles.map}
                        initialRegion = {{
                            latitude: 45,
                            longitude: 26,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        showsUserLocation={true}
                    />
                </View>
            )}
        </ProductContext.Consumer>
    )
};

MyMap.navigationOptions = () => ({
    headerTitle:"My Location"
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
