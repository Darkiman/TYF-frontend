import asyncStorageService from "./asyncStorageService";
import ax from '../utils/axios';

const USER_KEY = 'user';
const MAIL_KEY = 'email';
const PASSWORD_KEY = 'password';
const TOKEN_KEY = 'token';

const userService = {
    setUser: function(id, email, password, token, contacts) {
        ax.defaults.headers.common['Authorization'] = `Token ${token}`;
        return Promise.all([
            asyncStorageService.setItem(USER_KEY, id),
            asyncStorageService.setItem(MAIL_KEY, email),
            asyncStorageService.setItem(PASSWORD_KEY, password),
            asyncStorageService.setItem(TOKEN_KEY, token),
        ]);
    },
    getUser: async function() {
        const result = await Promise.all([
            asyncStorageService.getItem(USER_KEY),
            asyncStorageService.getItem(MAIL_KEY),
            asyncStorageService.getItem(PASSWORD_KEY),
            asyncStorageService.getItem(TOKEN_KEY),
        ]);
        return {
            id: result[0],
            email: result[1],
            password: result[2],
            token: result[3]
        }
    },
    deleteCurrentUser: function() {
       ax.defaults.headers.common['Authorization'] = '';
       return Promise.all([
           asyncStorageService.removeItem(USER_KEY),
           asyncStorageService.removeItem(MAIL_KEY),
           asyncStorageService.removeItem(PASSWORD_KEY),
           asyncStorageService.removeItem(TOKEN_KEY),
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
