import networkService from "../../utils/networkService";
import ax from "../../utils/axios";
import apiConfig from "../../utils/apiConfig";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


export const GET_POSITIONS_SUCCESS = 'maps/GET_POSITIONS_SUCCESS';
export const GET_POSITIONS_LOADING = 'maps/GET_POSITIONS_LOADING';
export const GET_POSITIONS_ERROR = 'maps/GET_POSITIONS_ERROR';

export const getContactsPosition = (id) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: GET_POSITIONS_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: GET_POSITIONS_LOADING,
    });
    return ax.get(`${apiConfig.url}location/contacts-position?&id=${id}`)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: GET_POSITIONS_SUCCESS,
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
            type: GET_POSITIONS_ERROR,
            payload: result
          });
          return result;
        });
  };
};


const mapsState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case GET_POSITIONS_SUCCESS:
      return {
        isLoading: false,
        data: action.payload
      };
    case GET_POSITIONS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case GET_POSITIONS_ERROR:
      return {
        isLoading: false,
        data: action.payload
      };
    default: {
      return state;
    }
  }
};

export default mapsState;
