import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
};


export const SAVE_OPTIONS_SUCCESS = 'contactOptions/SAVE_OPTIONS_SUCCESS';
export const SAVE_OPTIONS_LOADING = 'contactOptions/SAVE_OPTIONS_LOADING';
export const SAVE_OPTIONS_ERROR = 'contactOptions/SAVE_OPTIONS_ERROR';


export const saveContactOptions = (id, contactId, enableNotifications, distance) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: SAVE_OPTIONS_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: SAVE_OPTIONS_LOADING,
    });
    const data = {
      id: id,
      contactId: contactId,
      enableNotifications: enableNotifications,
      distance: distance
    };
    return ax.post(`contacts/saveOptions`, data)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: SAVE_OPTIONS_SUCCESS,
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
            type: SAVE_OPTIONS_ERROR,
            payload: result
          });
          return result;
        });
  };
};

const contactOptionsState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case SAVE_OPTIONS_SUCCESS:
      return {
        isLoading: false,
        error: false,
        data: action.payload
      };
    case SAVE_OPTIONS_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true
      };
    case SAVE_OPTIONS_ERROR:
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
