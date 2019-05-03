import axios from 'axios';
import apiConfig from "../../../utils/apiConfig";

const initialState = {
    isLoading: false,
    error: false,
};

export const SIGNUP_SUCCESS = 'auth/SIGN_UP';
export const SIGNUP_LOADING = 'auth/SIGN_UP_LOADING';
export const SIGNUP_ERROR = 'auth/SIGN_UP_ERROR';


export const signup = (userData) => {
    return dispatch => {
        dispatch({
            type: SIGNUP_LOADING,
        });
        return axios.post(`${apiConfig.url}auth/signup`, userData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(({ data }) => {
                dispatch({
                    type: SIGNUP_SUCCESS,
                    payload: data
                });
            }).catch(error => {
                dispatch({
                    type: SIGNUP_ERROR,
                    payload: error
                });
            });
    };
};

const signupState = (state: Object = initialState, action: Object) => {
    switch (action.type) {
        case SIGNUP_SUCCESS:
            return {
                ...state,
                user: action.payload
            };
        case SIGNUP_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case SIGNUP_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default: {
            return state;
        }
    }
};

export default signupState;
