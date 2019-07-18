import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";
import apiConfig from "../../../utils/apiConfig";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


export const GET_HISTORY_SUCCESS = 'maps/GET_HISTORY_SUCCESS';
export const GET_HISTORY_LOADING = 'maps/GET_HISTORY_LOADING';
export const GET_HISTORY_ERROR = 'maps/GET_HISTORY_ERROR';

export const getContactHistory = (id) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: GET_HISTORY_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: GET_HISTORY_LOADING,
    });
    return ax.get(`${apiConfig.url}location/history?&id=${id}`)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: GET_HISTORY_SUCCESS,
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
            type: GET_HISTORY_ERROR,
            payload: result
          });
          return result;
        });
  };
};


const historyMapState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case GET_HISTORY_SUCCESS:
      return {
        isLoading: false,
        data: action.payload
      };
    case GET_HISTORY_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case GET_HISTORY_ERROR:
      return {
        isLoading: false,
        data: action.payload
      };
    default: {
      return state;
    }
  }
};

export default historyMapState;
