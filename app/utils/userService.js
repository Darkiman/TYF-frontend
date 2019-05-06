import {AsyncStorage} from "react-native";
import asyncStorageService from "./asyncStorageService";

const userService = {
    setUser: function(id, email, password) {
        return Promise.all([asyncStorageService.setItem('user', id),
            asyncStorageService.setItem('email', email),
            asyncStorageService.setItem('password', password)]);
    },
    getUser: async function() {
        const result = await Promise.all([asyncStorageService.getItem('user'),
            asyncStorageService.getItem('email'),
            asyncStorageService.getItem('password')])
        return {
            id: result[0],
            email: result[1],
            password: result[2]
        }
    },
    deleteCurrentUser: function() {
       return Promise.all([asyncStorageService.removeItem('user'),
           asyncStorageService.removeItem('email'),
           asyncStorageService.removeItem('password')])
            .then(() => {
                console.log(`user deleted`)
            })
            .catch(error => {
                alert(error);
            });
    }
};
export default userService;
