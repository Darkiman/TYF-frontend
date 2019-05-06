import apiConfig from "../../../utils/apiConfig";
import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";

const initialState = {
    isLoading: false,
    error: false,
    data: {}
};

export const LOGIN_SUCCESS = 'auth/LOGIN';
export const LOGIN_LOADING = 'auth/LOGIN_LOADING';
export const LOGIN_ERROR = 'auth/LOGIN_ERROR';

export const login = (userData) => {
    return dispatch => {
        if(!networkService.isConnected) {
            dispatch({
                type: LOGIN_ERROR,
                payload: { data: 'internet_connection_not_available' }
            });
            return;
        }
        dispatch({
            type: LOGIN_LOADING,
        });
        return ax.post(`${apiConfig.url}auth/login`, userData)
            .then(({data}) => {
                const result = {
                    source: data,
                    error: false
                };
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: result
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
                    type: LOGIN_ERROR,
                    payload: result
                });
                return result;
            });
    };
};

const loginState = (state: Object = initialState, action: Object) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                isLoading: false,
                data: action.payload
            };
        case LOGIN_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case LOGIN_ERROR:
            return {
                isLoading: false,
                data: action.payload
            };
        default: {
            return state;
        }
    }
};

export default loginState;
