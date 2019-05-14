import {AsyncStorage} from "react-native";
import asyncStorageService from "./asyncStorageService";
import ax from '../utils/axios';

const userService = {
    setUser: function(id, email, password, token) {
        ax.defaults.headers.common['Authorization'] = `Token ${token}`;
        return Promise.all([
            asyncStorageService.setItem('user', id),
            asyncStorageService.setItem('email', email),
            asyncStorageService.setItem('password', password),
            asyncStorageService.setItem('password', token)
        ]);
    },
    getUser: async function() {
        const result = await Promise.all([
            asyncStorageService.getItem('user'),
            asyncStorageService.getItem('email'),
            asyncStorageService.getItem('password'),
            asyncStorageService.getItem('token')
        ]);
        return {
            id: result[0],
            email: result[1],
            password: result[2]
        }
    },
    deleteCurrentUser: function() {
       ax.defaults.headers.common['Authorization'] = '';
       return Promise.all([
           asyncStorageService.removeItem('user'),
           asyncStorageService.removeItem('email'),
           asyncStorageService.removeItem('password')
       ])
            .then(() => {
                console.log(`user deleted`)
            })
            .catch(error => {
                alert(error);
            });
    }
};
export default userService;
