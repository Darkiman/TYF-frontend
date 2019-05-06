import {AsyncStorage} from "react-native";

const asyncStorageService = {
    setItem: function(key, value) {
        return AsyncStorage.setItem(key,value);
    },
    getItem:function (key) {
        return AsyncStorage.getItem(key);
    },
    removeItem: function (key) {
        return AsyncStorage.removeItem(key);
    }
};

export default asyncStorageService;
