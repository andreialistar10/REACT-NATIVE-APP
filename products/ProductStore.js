import React, {useCallback, useContext, useEffect} from 'react';
import { getLogger, httpGet, httpPost} from "../core";
import {ProductContext} from './ProductContext';
import {AuthContext} from "../auth/AuthContext";

const log = getLogger('ProductStore');

const initialState = {
    isLoading: false,
    products: null,
    loadingError: null,
};

export const ProductStore = ({children}) => {
    const [state, setState] = React.useState(initialState);
    const {isLoading, products, loadingError} = state;
    const {token} = useContext(AuthContext);
    useEffect(() => {
        if (token && !products && !loadingError && !isLoading) {
            log('load products started');
            setState({isLoading: true, loadingError: null});
            httpGet('entities')
                .then(json => {
                    log('load products succeeded');
                    setState({isLoading: false, products: json});
                })
                .catch(loadingError => {
                    log('load products failed');
                    setState({isLoading: false, loadingError})
                });
        }
    }, [token]);

    const onSubmit = useCallback(async (name, price) => {
        log('post product started');
        return httpPost('entities', {name, price})
            .then(json => {
                log('post product succeeded');
                setState({isLoading: false, products: products.concat(json)});
                return Promise.resolve(json);
            })
            .catch(error => {
                log('post product failed');
                return Promise.reject(error);
            })
    });

    const addNewProduct = useCallback(async (message) => {
       setState({isLoading: false, products: products.concat(message)});
    });

    const updateProduct = useCallback(async (message) =>{
       const newProducts = products.map(product => {
           return product.id === message.id ? message : product;
       });
       setState({isLoading: false, products: newProducts });
    });

    log('render', isLoading);
    const value = {...state, onSubmit, addNewProduct, updateProduct};
    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
};
