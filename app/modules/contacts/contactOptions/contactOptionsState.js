import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


export const CHANGE_OPTIONS_SUCCESS = 'contactOptions/CHANGE_OPTIONS_SUCCESS';
export const CHANGE_OPTIONS_LOADING = 'contactOptions/CHANGE_OPTIONS_LOADING';
export const CHANGE_OPTIONS_ERROR = 'contactOptions/CHANGE_OPTIONS_ERROR';


export const changeOptions = (id, query) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: CHANGE_OPTIONS_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: CHANGE_OPTIONS_LOADING,
    });
    return ax.get(`contacts/search?id=${id}&query=${query}`)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: CHANGE_OPTIONS_SUCCESS,
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
            type: CHANGE_OPTIONS_LOADING,
            payload: result
          });
          return result;
        });
  };
};

const contactOptionsState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case CHANGE_OPTIONS_SUCCESS:
      return {
        isLoading: false,
        error: false,
        data: action.payload
      };
    case CHANGE_OPTIONS_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true
      };
    case CHANGE_OPTIONS_ERROR:
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

export default contactOptionsState;
