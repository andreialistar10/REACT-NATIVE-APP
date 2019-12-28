import { getLogger } from "../core";
import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { ProductContext } from './ProductContext';
import MapView from 'react-native-maps';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const log = getLogger('MyMap');

const initialState = {
    latitude: 0,
    longitude: 0,
    isLoading: true
};

export const MyMap = () => {
    log('render');
    const [state, setState] = useState(initialState);
    const {getCurrentLocation} = useContext(ProductContext);
    useEffect(() => {
       log('didMount');
       if (state.isLoading)
           getCurrentLocation()
               .then(coordinate => {
                  log(coordinate);
                  const {latitude, longitude} = coordinate;
                  setState({latitude,longitude,isLoading: false});
               });
        return () => {
            log('willUnmount');
        }
    });
    return (
        <ProductContext.Consumer>
            {() => {
                const {latitude, longitude, isLoading} = state;
                return (
                <View style ={styles.container}>
                    <ActivityIndicator animating = {isLoading} size = 'large'/>
                    {!isLoading && <MapView
                        style={styles.map}
                        initialRegion = {{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA
                        }}

                        showsUserLocation={true}
                    />}
                </View>
            )}}
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
