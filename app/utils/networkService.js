import NetInfo from "@react-native-community/netinfo";


const listener = data => {
    networkService.connectionType = data.type;
    networkService.effectiveType = data.effectiveType;
    networkService.isConnected  = data.type !== 'none';
};

const networkService = {
    connectionType : '',
    effectiveType: '',
    subscription: null,
    removeNetworkListen: function() {
        if(this.subscription && this.subscription.remove) {
            subscription.remove();
        }
        NetInfo.removeEventListener('connectionChange', listener);
    },
    getErrorText: function(error) {
        return error && error.response ? error.response.data : (error.message ? 'server_is_not_available' : error)
    }
};

NetInfo.getConnectionInfo().then(listener);
const subscription = NetInfo.addEventListener('connectionChange', listener);
networkService.subscription = subscription;

export default networkService;
