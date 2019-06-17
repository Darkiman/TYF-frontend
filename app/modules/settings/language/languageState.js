import ax from "../../../utils/axios";
import networkService from "../../../utils/networkService";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};

export const CHANGE_LANGUAGE_SUCCESS = 'language/CHANGE_LANGUAGE_SUCCESS';
export const CHANGE_LANGUAGE_LOADING = 'language/CHANGE_LANGUAGE_LOADING';
export const CHANGE_LANGUAGE_ERROR = 'language/CHANGE_LANGUAGE_ERROR';

export const changeLanguage = (id, language) => {
    return dispatch => {
        if(!networkService.isConnected) {
            dispatch({
                type: CHANGE_LANGUAGE_ERROR,
                payload: { data: 'internet_connection_not_available' }
            });
            return;
        }
        dispatch({
            type: CHANGE_LANGUAGE_LOADING,
        });
        const data = {
          id: id,
          language: language
        };
        return ax.post(`profile/language`, data)
            .then(({data}) => {
                const result = {
                    source: data,
                    error: false
                };
                dispatch({
                    type: CHANGE_LANGUAGE_SUCCESS,
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
                    type: CHANGE_LANGUAGE_ERROR,
                    payload: result
                });
                return result;
            });
    };
};


const languageState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
      case CHANGE_LANGUAGE_SUCCESS:
          return {
              isLoading: false,
              error: false,
              data: action.payload,
              language: action.payload
          };
      case CHANGE_LANGUAGE_LOADING:
          return {
              ...state,
              error: false,
              isLoading: true,
          };
      case CHANGE_LANGUAGE_ERROR:
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

export default languageState;
