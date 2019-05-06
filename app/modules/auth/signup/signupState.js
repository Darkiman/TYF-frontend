import ax from "../../../utils/axios";
import NetInfo from "@react-native-community/netinfo";
import networkService from "../../../utils/networkService";


const initialState = {
    isLoading: false,
    error: false,
    data: {}
};

export const SIGNUP_SUCCESS = 'auth/SIGN_UP';
export const SIGNUP_LOADING = 'auth/SIGN_UP_LOADING';
export const SIGNUP_ERROR = 'auth/SIGN_UP_ERROR';


export const signup = (userData) => {
    return async (dispatch) => {
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
        try {
           const data = await ax.post(`auth/signup`, userData)
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: data
            });
            return data;
        }
        catch (error) {
            dispatch({
                type: SIGNUP_ERROR,
                payload: error && error.response ? error.response : error
            });
            return error;
        }
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
