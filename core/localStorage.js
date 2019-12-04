import {AsyncStorage} from 'react-native';

const TOKEN_ID = 'token';
const LAST_INDEX_ID = 'lastIndex';

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

export const removeToken = () => AsyncStorage.removeItem(TOKEN_ID);

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
