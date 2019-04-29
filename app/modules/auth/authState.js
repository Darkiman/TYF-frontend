import axios from 'axios';

const initialState = {
    isLoading: false,
    error: false,
};

export const LOGIN = 'auth/LOGIN';
export const SIGNUP = 'auth/SIGN_UP';


export const login = () => {
    return dispatch => {
        return axios.get("http://10.0.2.2:3050/api/users/")
            .then(({ data }) => {
                console.log(data);
                dispatch({
                    type: LOGIN,
                    payload: data
                });
            }).catch(error => {
                console.log(error);
                dispatch({
                    type: LOGIN,
                    data: error
                });
            });
    };

};

export const signup = () => {
    return dispatch => {
        dispatch({
            type: SIGNUP
        });
    };
};

const authState = (state: Object = initialState, action: Object) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                login: action.payload
            };
        case SIGNUP:
            return state;
        default: {
            return state;
        }
    }
};

export default authState;
