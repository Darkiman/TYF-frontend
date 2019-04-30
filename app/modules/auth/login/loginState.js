import axios from 'axios';
import apiConfig from "../../../utils/apiConfig";

const initialState = {
    isLoading: false,
    error: false,
};

export const LOGIN_SUCCESS = 'auth/LOGIN';
export const LOGIN_LOADING = 'auth/LOGIN_LOADING';
export const LOGIN_ERROR = 'auth/LOGIN_ERROR';

export const login = (userData) => {
    return dispatch => {
        dispatch({
            type: LOGIN_LOADING,
        });
        return axios.post(`${apiConfig.url}auth/login`, userData)
            .then(({ data }) => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: data
                });
            }).catch(error => {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: error
                });
            });
    };
};

const loginState = (state: Object = initialState, action: Object) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload
            };
        case LOGIN_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case LOGIN_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default: {
            return state;
        }
    }
};

export default loginState;
