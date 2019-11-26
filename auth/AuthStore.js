import React, { useCallback, useReducer } from 'react';
import {getLogger, httpPost, setToken} from "../core";
import { Provider } from './AuthContext';
const log = getLogger('AuthStore');

const SET_TOKEN = 'SET_TOKEN';
const LOGIN_STARTED = 'LOGIN_STARTED';
const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
const LOGIN_FAILED = 'LOGIN_FAILED';

const initialState={
  token: null,
  loginError: null,
  loginInProgress: false,
};

function reducer(state, action) {
    log('reducer', action);
    const { type, payload } = action;
    switch (type) {
        case SET_TOKEN:
            return {...state, token: payload.jwt};
        case LOGIN_STARTED:
            return {...state, loginError: null, loginInProgress: true};
        case LOGIN_SUCCEEDED:
            return {...state, token:payload.token, loginInProgress: false};
        case LOGIN_FAILED:
            return {...state, loginError: payload.error, loginInProgress: false};
        default:
            return state;
    }
}

export const AuthStore = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const onLoadToken = useCallback(async () => {
        log ('loadToken...');
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        }).then(() => {
            dispatch({type: SET_TOKEN, payload: {token: null} });
            return Promise.resolve(null);
        })
    }, []);

    const onLogin = useCallback(async (username,password) => {
        log('loadToken...');
        dispatch({type: LOGIN_STARTED});
        return httpPost('login',{username, password})
            .then(tokenHolder => {
                const {jwt} = tokenHolder;
                dispatch({ type: LOGIN_SUCCEEDED, payload: {jwt}});
                setToken(jwt);
                return jwt;
            }).
            catch(error => {
                dispatch({type: LOGIN_FAILED, payload: { error } });
                return Promise.reject(error);
            })
    },[]);

    const value = {...state, onLoadToken, onLogin };
    log('render', value);
    return(
        <Provider value={value}>
            {children}
        </Provider>
    )
};
