import ax from "../../../utils/axios";
import networkService from './../../../utils/networkService';

const initialState = {
    isLoading: false,
    error: false,
    data: {}
};

export const SIGNUP_SUCCESS = 'auth/SIGN_UP';
export const SIGNUP_LOADING = 'auth/SIGN_UP_LOADING';
export const SIGNUP_ERROR = 'auth/SIGN_UP_ERROR';


export const signup = (userData) => {
    return dispatch => {
        if(!networkService.isConnected) {
            dispatch({
                type: SIGNUP_ERROR,
                payload: { data: 'internet_connection_not_available' }
            });
            return;
        }
        dispatch({
            type: SIGNUP_LOADING,
        });
        return ax.post(`auth/signup`, userData)
            .then(({data}) => {
                const result = {
                    source: data,
                    error: false
                };
                dispatch({
                    type: SIGNUP_SUCCESS,
                    payload: data
                });
                return result;
            }).catch(error => {
                const text = networkService.getErrorText(error);
                const result =  {
                    source: error,
                    error: true,
                    message: text
                };
                dispatch({
                    type: SIGNUP_ERROR,
                    payload: result
                });
                return result;
            });
    };
};

const signupState = (state: Object = initialState, action: Object) => {
    switch (action.type) {
        case SIGNUP_SUCCESS:
            return {
                isLoading: false,
                error: false,
                data: action.payload
            };
        case SIGNUP_LOADING:
            return {
                ...state,
                error: false,
                isLoading: true
            };
        case SIGNUP_ERROR:
            return {
                isLoading: false,
                error: true,
                data: action.payload
            };
        default: {
            return state;
        }
    }
};

export default signupState;
