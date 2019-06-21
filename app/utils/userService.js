import asyncStorageService from "./asyncStorageService";
import ax from '../utils/axios';
import userKeys from "../constants/userKeys";

let _currentUser = null;

const userService = {
    setUser: function (user) {
        ax.defaults.headers.common['Authorization'] = `Token ${user.token}`;
        _currentUser = user;
        const stringValue = JSON.stringify(user);
        return Promise.all([
            asyncStorageService.setItem(userKeys.USER_KEY, stringValue)
        ]);
    },
    getUser: async function () {
        if(_currentUser) {
            return _currentUser;
        }
        const data = await Promise.all([
            asyncStorageService.getItem(userKeys.USER_KEY)
        ]);
        const result = JSON.parse(data[0]);
        let user;
        if(!result) {
            user = null;
        } else {
            user = {
                id: result.id,
                email: result.email,
                name: result.name,
                password: result.password,
                token: result.token,
                tracking: result.tracking,
                avatar: result.avatar,
                language: result.language,
                notificationToken: result.notificationToken
            };
        }
        _currentUser = user;
        return user;
    },
    deleteCurrentUser: function () {
        ax.defaults.headers.common['Authorization'] = '';
        _currentUser = null;
        return Promise.all([
            asyncStorageService.removeItem(userKeys.USER_KEY),
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
