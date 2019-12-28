import React, {useCallback, useContext, useEffect} from 'react';
import {
    addAllProducts,
    addEventWhenConnectedToWifi,
    clearStorage,
    getAllProducts,
    getAllUnsavedProducts,
    getLogger, getToken,
    httpGet,
    httpPost,
    insertProduct,
    insertUnsavedProduct,
    isConnectedToWifi,
    removeAllProducts,
    updateProductLocalStorage,
} from "../core";
import {ProductContext} from './ProductContext';
import {AuthContext} from "../auth/AuthContext";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const log = getLogger('ProductStore');

const initialState = {
    isLoading: false,
    products: null,
    loadingError: null,
    connectedToWifi: false,
};

export const ProductStore = ({children}) => {
    const [state, setState] = React.useState(initialState);
    const {isLoading, products, loadingError} = state;
    const {token} = useContext(AuthContext);
    const offline = () => {
        log("Notify offline");
        setState({connectedToWifi: false});
    };
    const online = () => {
        log("Notify online");
        setState({connectedToWifi: true});
    };
    useEffect(() => {
        const unsubscribe = addEventWhenConnectedToWifi(online, offline);
        isConnectedToWifi()
            .then((value) => {
                getToken()
                    .then((token) =>{
                        if (token && !products && !loadingError && !isLoading && value) {
                            log('load products started');
                            setState({isLoading: true, loadingError: null, connectedToWifi: true});
                            getAllUnsavedProducts()
                                .then(products => {
                                    log('save local persistence started...');
                                    if (!products)
                                        return Promise.resolve(null);
                                    products = products.map(product => httpPost('entities', product));
                                    return Promise.all(products);
                                })
                                .then((products) => {
                                    log('save local persistence succeeded');
                                    httpGet('entities')
                                        .then(json => {
                                            log('load products succeeded');
                                            setState({isLoading: false, products: json});

                                            return removeAllProducts()
                                                .then(() => json);
                                        })
                                        .then((products) => addAllProducts(products))
                                        .catch(loadingError => {
                                            log('load products failed');
                                            setState({isLoading: false, loadingError});
                                        });
                                });
                        }
                    });
            });

        return () => {
            unsubscribe();
        }
    });

    const onSubmit = useCallback(async (name, price) => {
        log('post product started');
        return isConnectedToWifi()
            .then(value => {
                if (value) {
                    log('Online storage started...');
                    return httpPost('entities', {name, price})
                        .then(json => {
                            log('post product succeeded');
                            setState({isLoading: false, products: products.concat(json)});
                            insertProduct(json)
                                .then(() => json);
                        })
                        .catch(error => {
                            log('post product failed');
                            return Promise.reject(error);
                        })
                }
                log('Offline storage started...');
                return insertUnsavedProduct({name: name, price: price})
                    .then(product => {
                        log('Offline storage succeeded');
                        setState({isLoading: false, products: products.concat(product)});
                        return Promise.resolve(product);
                    })
            });
    });

    const addNewProduct = useCallback(async (message) => {
        setState({isLoading: false, products: products.concat(message)});
        insertProduct(message);
    });

    const updateProduct = useCallback(async (message) => {
        const newProducts = products.map(product => {
            return product.id === message.id ? message : product;
        });
        setState({isLoading: false, products: newProducts});
        updateProductLocalStorage(message);
    });

    const logout = useCallback(async () => {
        setState({isLoading: false, products: null});
        return clearStorage();
    });

    const getAllProductsFromLocalStorage = useCallback(async () => {
        log('getAllProducts started');
        getAllProducts()
            .then(products => {
                if (!products)
                    return;
                products = products.map(([id, product]) => JSON.parse(product));
                setState({isLoading: false, products: products})
            })
            .catch(error => {
                log('getAllProducts failed');
                log(error);
                return Promise.reject(null);
            });
    });

    const getCurrentLocation = useCallback(async () => {
        log('getCurrentLocation started');
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            return Promise.reject(null);
        }
        let location = await Location.getCurrentPositionAsync({});
        const {latitude, longitude} = location.coords;
        return Promise.resolve({latitude, longitude});
    });

    log('render', isLoading);
    const value = {...state, onSubmit, addNewProduct, updateProduct, logout, getAllProductsFromLocalStorage, getCurrentLocation};
    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
};
