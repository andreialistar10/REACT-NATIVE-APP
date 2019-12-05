import NetInfo from "@react-native-community/netinfo";

const WIFI = "wifi";

export const isConnectedToWifi = () =>
    NetInfo.fetch()
        .then(state => {
            const {type, isConnected} = state;
            return Promise.resolve(type === WIFI && isConnected);
        });

let lastConnection = false;

export const addEventWhenConnectedToWifi = (callbackToExecuteOnConnected, callbackToExecuteOnNotConnected) => {

    return NetInfo.addEventListener(state => {

        setTimeout(() => {
            const {type, isConnected} = state;
            if (type === WIFI && isConnected) {
                console.log("connected");
                if (!lastConnection) {
                    callbackToExecuteOnConnected();
                    lastConnection = true;
                }
            }
            else {
                if (lastConnection){
                    callbackToExecuteOnNotConnected();
                    lastConnection = !lastConnection;
                }
                console.log("is not connected to wifi");
            }
        }, 5000);

    });
};
