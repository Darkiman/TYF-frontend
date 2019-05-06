import {Platform} from "react-native";

const apiConfig = {
    url: Platform.OS === 'ios' ? 'http://localhost:3050/api/' : 'http://10.0.2.2:3050/api/'
};

export default apiConfig;

