import asyncStorageService from "./asyncStorageService";
import ax from '../utils/axios';
import userKeys from "../constants/userKeys";

const userService = {
    setUser: function (id, email, name, password, token, tracking, avatar) {
        ax.defaults.headers.common['Authorization'] = `Token ${token}`;
        const user = {
            id,
            email,
            name,
            password,
            token,
            tracking: tracking.toString(),
            avatar
        };
        const stringValue = JSON.stringify(user);
        return Promise.all([
            asyncStorageService.setItem(userKeys.USER_KEY, stringValue)
        ]);
    },
    getUser: async function () {
        const data = await Promise.all([
            asyncStorageService.getItem(userKeys.USER_KEY)
        ]);
        const result = JSON.parse(data[0]);
        console.log(result);
        return {
            id: result.id,
            email: result.email,
            name: result.name,
            password: result.password,
            token: result.token,
            tracking: result.tracking === 'true',
            avatar: result.avatar
        }
    },
    deleteCurrentUser: function () {
        ax.defaults.headers.common['Authorization'] = '';
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
