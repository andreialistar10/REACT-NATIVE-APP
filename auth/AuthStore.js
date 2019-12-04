import React, {useCallback, useReducer} from 'react';
import {getLogger, httpPostLogin, updateToken, getToken} from "../core";
import {Provider} from './AuthContext';

const log = getLogger('AuthStore');

const SET_TOKEN = 'SET_TOKEN';
const LOGIN_STARTED = 'LOGIN_STARTED';
const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
const LOGIN_FAILED = 'LOGIN_FAILED';

const initialState = {
    token: null,
    loginError: null,
    loginInProgress: false,
};

function reducer(state, action) {
    log('reducer', action);
    const {type, payload} = action;
    switch (type) {
        case SET_TOKEN: {
            console.log(payload);
            console.log(payload.jwt);
            return {...state, token: payload.jwt};
        }
        case LOGIN_STARTED:
            return {...state, loginError: null, loginInProgress: true};
        case LOGIN_SUCCEEDED:
            return {...state, token: payload.jwt, loginInProgress: false};
        case LOGIN_FAILED:
            return {...state, loginError: payload.error, loginInProgress: false};
        default:
            return state;
    }
}

export const AuthStore = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const onLoadToken = useCallback(async () => {
        log('loadToken...');
        return getToken()
            .then((value) => {
                dispatch({type: SET_TOKEN, payload: {jwt: value}});
                return Promise.resolve(value);
            })
    });

    const onLogin = useCallback(async (username, password) => {
        log('loadToken...');
        dispatch({type: LOGIN_STARTED});
        return httpPostLogin('login', {username, password})
            .then(tokenHolder => {
                const {jwt} = tokenHolder;
                dispatch({type: LOGIN_SUCCEEDED, payload: {jwt}});
                return updateToken(jwt).then(() => {
                    return Promise.resolve(jwt);
                });
            })
            .catch(error => {
                dispatch({type: LOGIN_FAILED, payload: {error}});
                return Promise.reject(error);
            })
    }, []);

    const value = {...state, onLoadToken, onLogin};
    log('render', value);
    return (
        <Provider value={value}>
            {children}
        </Provider>
    )
};
