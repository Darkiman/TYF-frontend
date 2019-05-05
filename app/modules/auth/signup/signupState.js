import ax from "../../../utils/axios";

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
        dispatch({
            type: SIGNUP_LOADING,
        });
        return ax.post(`auth/signup`, userData)
            .then(({data}) => {
                dispatch({
                    type: SIGNUP_SUCCESS,
                    payload: data
                });
                return data;
            }).catch(error => {
                dispatch({
                    type: SIGNUP_ERROR,
                    payload: error && error.response ? error.response : error
                });
                return error;
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
