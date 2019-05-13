import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


export const SEARCH_CONTACTS_SUCCESS = 'contracts/SEARCH_CONTACTS_SUCCESS';
export const SEARCH_CONTACTS_LOADING = 'contracts/SEARCH_CONTACTS_LOADING';
export const SEARCH_CONTACTS_ERROR = 'contracts/SEARCH_CONTACTS_ERROR';


export const searchContacts = (id, query) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: SEARCH_CONTACTS_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: SEARCH_CONTACTS_LOADING,
    });
    return ax.get(`contacts/search?id=${id}&query=${query}`)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: SEARCH_CONTACTS_SUCCESS,
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
            type: SEARCH_CONTACTS_LOADING,
            payload: result
          });
          return result;
        });
  };
};

const searchContactsState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case SEARCH_CONTACTS_SUCCESS:
      return {
        isLoading: false,
        error: false,
        data: action.payload
      };
    case SEARCH_CONTACTS_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true
      };
    case SEARCH_CONTACTS_ERROR:
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

export default searchContactsState;
