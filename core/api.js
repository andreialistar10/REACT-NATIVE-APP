import qs from 'qs';
import {Client} from '@stomp/stompjs';
import * as encoding from 'text-encoding';

let SockJS = require('sockjs-client/dist/sockjs.js');

const apiUrl = '192.168.100.3:8080';
const notificationsUrl = `192.168.100.3:8099/ws`;

export const httpApiUrl = `http://${apiUrl}/academic-courses`;

export const webSocketUrl = `http://${notificationsUrl}`;

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

let token;
let client;

export const setToken = value => {
    token = value;
};

export const buildHeaders = () => {
    const headers = {...defaultHeaders};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
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

export const httpGet = path =>
    withErrorHandling(
        fetch(`${httpApiUrl}/${path}`, {
            method: 'GET',
            headers: buildHeaders(),
        })
    );

export const httpPost = (path, payload) =>
    withErrorHandling(
        fetch(`${httpApiUrl}/${path}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: buildHeaders(),
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

export const openWebSocket = (callbackForNotify = (message) => { console.log(message.body) }) => {

    if (!client)
        buildClientSocket();
    client.onConnect = () => {
        client.subscribe('/topic/messages',callbackForNotify);
    };
    client.activate();
};

export const closeWebSocket = () => {
    client.deactivate();
};
