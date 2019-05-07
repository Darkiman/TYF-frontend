import networkService from "../../utils/networkService";
import ax from "../../utils/axios";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


export const GET_CONTACTS_SUCCESS = 'contracts/GET_CONTACTS_SUCCESS';
export const GET_CONTACTS_LOADING = 'contracts/GET_CONTACTS_LOADING';
export const GET_CONTACTS_ERROR = 'contracts/GET_CONTACTS_ERROR';


export const getContacts = (id) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: GET_CONTACTS_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: GET_CONTACTS_LOADING,
    });
    return ax.get(`contacts/?id=${id}`)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: GET_CONTACTS_SUCCESS,
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
            type: GET_CONTACTS_LOADING,
            payload: result
          });
          return result;
        });
  };
};

const contactsState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case GET_CONTACTS_SUCCESS:
      return {
        isLoading: false,
        error: false,
        data: action.payload
      };
    case GET_CONTACTS_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true
      };
    case GET_CONTACTS_ERROR:
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

export default contactsState;
