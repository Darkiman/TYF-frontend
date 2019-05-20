import asyncStorageService from "./asyncStorageService";
import ax from '../utils/axios';
import userKeys from "../constants/userKeys";

const userService = {
    setUser: function(id, email, password, token, tracking) {
        ax.defaults.headers.common['Authorization'] = `Token ${token}`;
        return Promise.all([
            asyncStorageService.setItem(userKeys.USER_KEY, id),
            asyncStorageService.setItem(userKeys.MAIL_KEY, email),
            asyncStorageService.setItem(userKeys.PASSWORD_KEY, password),
            asyncStorageService.setItem(userKeys.TOKEN_KEY, token),
            asyncStorageService.setItem(userKeys.TRACKING_KEY, tracking.toString()),
        ]);
    },
    getUser: async function() {
        const result = await Promise.all([
            asyncStorageService.getItem(userKeys.USER_KEY),
            asyncStorageService.getItem(userKeys.MAIL_KEY),
            asyncStorageService.getItem(userKeys.PASSWORD_KEY),
            asyncStorageService.getItem(userKeys.TOKEN_KEY),
            asyncStorageService.getItem(userKeys.TRACKING_KEY),
        ]);
        return {
            id: result[0],
            email: result[1],
            password: result[2],
            token: result[3],
            tracking: result[4] === 'true'
        }
    },
    deleteCurrentUser: function() {
       ax.defaults.headers.common['Authorization'] = '';
       return Promise.all([
           asyncStorageService.removeItem(userKeys.USER_KEY),
           asyncStorageService.removeItem(userKeys.MAIL_KEY),
           asyncStorageService.removeItem(userKeys.PASSWORD_KEY),
           asyncStorageService.removeItem(userKeys.TOKEN_KEY),
           asyncStorageService.removeItem(userKeys.TRACKING_KEY)
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
