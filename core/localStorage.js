import {AsyncStorage} from 'react-native';

const TOKEN_ID = 'token';
const LAST_INDEX_ID = 'lastIndex';
const NOT_SAVED_FLAG = false;

export const removeAllProducts = () => {
    return AsyncStorage.getAllKeys()
        .then(keys => {
            return keys.filter((id) => id !== TOKEN_ID)
        })
        .then(keys => {
            if (keys.length !== 0)
                AsyncStorage.multiRemove(keys);
            return Promise.resolve(null);
        })
};

const updateLastIndex = (stringValue) => AsyncStorage.setItem(LAST_INDEX_ID, stringValue);

export const addAllProducts = (products) => {
    let lastIndex = products[products.length - 1].id + '';
    products = products.map(product => ['' + product.id, JSON.stringify(product)]);
    products.push([LAST_INDEX_ID, lastIndex]);
    return AsyncStorage.multiSet(products);
};

export const updateProductLocalStorage = (product) => AsyncStorage.setItem('' + product.id, JSON.stringify(product));

export const updateToken = (token) => AsyncStorage.setItem(TOKEN_ID, token);

export const getToken = () => AsyncStorage.getItem(TOKEN_ID);

export const clearStorage = () => AsyncStorage.clear();

export const getAllProducts = () => {
    return AsyncStorage.getAllKeys()
        .then(keys => {
            return keys.filter(id => id !== TOKEN_ID && id !== LAST_INDEX_ID)
        })
        .then(keys => {
            // console.log(keys);
            if (keys.length !== 0)
                return AsyncStorage.multiGet(keys);
            return Promise.resolve(null);
        })
};

export const getAllUnsavedProducts = () => {
    return getAllProducts()
        .then(products => {
            if (!products)
                return Promise.resolve(null);
            products = products.map(([id, product]) => JSON.parse(product))
                .filter((product) => {
                    return product.saved === NOT_SAVED_FLAG;
                });
            return Promise.resolve(products);
        })
};

export const insertProduct = (product) => {
    return updateProductLocalStorage(product)
        .then(() => updateLastIndex(product.id + ''))

    // debugging purpose
    // .then(() => AsyncStorage.getAllKeys())
    // .then((keys) => {
    //     console.log(keys);
    // })
    // .then(() => AsyncStorage.getItem(LAST_INDEX_ID))
    // .then((el) =>{
    //     console.log(el);
    // })
};

export const insertUnsavedProduct = (product) => {
    return AsyncStorage.getItem(LAST_INDEX_ID)
        .then(index => {
            product.id = +index + 1;
            product.saved = NOT_SAVED_FLAG;
            return AsyncStorage.setItem('' + product.id, JSON.stringify(product))
                .then(() => AsyncStorage.setItem(LAST_INDEX_ID, '' + product.id))
                .then(() => product);
        })
};
