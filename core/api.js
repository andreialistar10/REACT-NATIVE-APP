export const apiUrl = '36e06fa7.ngrok.io';

export const httpApiUrl = `http://${apiUrl}/academic-courses`;

export const webSocketUrl = `ws://${apiUrl}`;

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

let token;

export const setToken = value => {
    token = value;
};

const buildHeaders = () => {
    const headers = {...defaultHeaders };
    if (token){
        headers.Authorization =`Bearer ${token}`;
    }
    return headers;
};

const defaultIssue = { issue: [{error: 'Unexpected error'}] };

const withErrorHandling = fetchPromise =>
    fetchPromise.then(response => Promise.all(response.ok,response.json()))
        .then(([responseOK, responseJson]) => {
           if (responseOK){
               return responseJson;
           }
           log("error",responseJson);
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
        fetch(`${httpApiUrl}/${path}`,{
            method: 'POST',
            body: JSON.stringify(payload),
            headers: buildHeaders(),
        })
    );
