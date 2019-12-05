import qs from 'qs';
import {Client} from '@stomp/stompjs';
import {getToken} from './localStorage';
import * as encoding from 'text-encoding';

let SockJS = require('sockjs-client/dist/sockjs.js');

const ADD = "ADD";
const UPDATE = "UPDATE";
const apiIp = '192.168.100.3';
const apiUrl = `${apiIp}:8080`;
const notificationsUrl = `${apiIp}:8099/ws`;

export const httpApiUrl = `http://${apiUrl}/academic-courses`;

export const webSocketUrl = `http://${notificationsUrl}`;

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

let client;
let connectedToWebSocket = false;

export const buildHeaders = (value) => {
    const headers = {...defaultHeaders};
    if (value) {
        headers.Authorization = `Bearer ${value}`;
    }
    return headers;
};

const buildLoginHeaders = () => {
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    };
};

const defaultIssue = {issue: [{error: 'Unexpected error'}]};

const withErrorHandling = fetchPromise => fetchPromise
    .then(response => Promise.all([response.ok, response.json()]))
    .then(([responseOK, responseJson]) => {
        if (responseOK) {
            return responseJson;
        }
        const message = (responseJson || defaultIssue).issue
            .map(it => it.error)
            .join('\n');
        throw new Error(message);
    });

export const httpGet = path => {

    return withErrorHandling(
        getToken()
            .then((jwt) => fetch(`${httpApiUrl}/${path}`, {
                method: 'GET',
                headers: buildHeaders(jwt),
            }))
    )
};

export const httpPost = (path, payload) =>
    withErrorHandling(
        getToken()
            .then((jwt) => {
                return fetch(`${httpApiUrl}/${path}`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: buildHeaders(jwt),
                });
            })
    );

export const httpPostLogin = (path, payload) =>
    withErrorHandling(
        fetch(`${httpApiUrl}/${path}`, {
            method: 'POST',
            body: qs.stringify(payload),
            headers: buildLoginHeaders(),
        })
    );

const buildClientSocket = () => {

    client = new Client();
    client.configure({
        appendMissingNULLonIncoming: true,
        logRawCommunication: true,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        webSocketFactory: () => {
            return SockJS(webSocketUrl);
        },
        beforeConnect: () => {
            //log("trying to connect");
        },
        onStompError: () => {
            //log("STOMP ERROR");
        },
        onWebSocketError: () => {
            //log("WS ERROR");
        },
        debug: (str) => {
            console.log(new Date(), str);
        }
    });
};

export const openWebSocket = (callbackAdd = (message) => {
    console.log(message)
}, callbackUpdate = (message) => {
    console.log(message)
}) => {
    if (connectedToWebSocket)
        return;
    if (!client)
        buildClientSocket();
    client.onConnect = () => {
        client.subscribe('/topic/messages', (message) => {
            message = JSON.parse(message.body);
            if (message.type === ADD)
                callbackAdd(message.entity);
            else if (message.type === UPDATE)
                callbackUpdate(message.entity);
        });
    };
    client.activate();
    connectedToWebSocket = true;
};

export const closeWebSocket = () => {

    if (connectedToWebSocket) {
        client.deactivate();
        connectedToWebSocket = false;
    }
};
