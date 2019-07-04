import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";

const initialState = {
  isLoading: false,
  error: false,
  data: {},
};

export const SAVE_CONFIDENTIALITY_SUCCESS = 'confidentiality/SAVE_CONFIDENTIALITY_SUCCESS';
export const SAVE_CONFIDENTIALITY_LOADING = 'confidentiality/SAVE_CONFIDENTIALITY_LOADING';
export const SAVE_CONFIDENTIALITY_ERROR = 'confidentiality/SAVE_CONFIDENTIALITY_ERROR';

export const saveConfidentiality = (id, confidentiality) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: SAVE_CONFIDENTIALITY_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: SAVE_CONFIDENTIALITY_LOADING,
    });
    const data = {
      id: id,
      confidentiality: confidentiality
    };
    return ax.post(`profile/info`, data)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: SAVE_CONFIDENTIALITY_SUCCESS,
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
            type: SAVE_CONFIDENTIALITY_ERROR,
            payload: result
          });
          return result;
        });
  };
};


const confidentialityState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case SAVE_CONFIDENTIALITY_SUCCESS:
      return {
        isLoading: false,
        error: false,
        data: action.payload,
        confidentiality: action.payload
      };
    case SAVE_CONFIDENTIALITY_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true,
      };
    case SAVE_CONFIDENTIALITY_ERROR:
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

export default confidentialityState;
