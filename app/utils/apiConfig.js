import {Platform} from "react-native";

const apiConfig = {
    // static: Platform.OS === 'ios' ? 'http://127.0.0.1:3050/static/' : 'http://10.0.2.2:3050/static/',
    // url: Platform.OS === 'ios' ? 'http://127.0.0.1:3050/api/' : 'http://10.0.2.2:3050/api/'
    static: Platform.OS === 'ios' ? 'http://10.0.2.32:3050/static/' : 'http://10.0.2.2:3050/static/',
    url: Platform.OS === 'ios' ? 'http://10.0.2.32:3050/api/' : 'http://10.0.2.2:3050/api/'
};

export default apiConfig;

