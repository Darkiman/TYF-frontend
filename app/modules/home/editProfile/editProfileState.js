import networkService from "../../../utils/networkService";
import ax from "../../../utils/axios";
import apiConfig from "../../../utils/apiConfig";

const initialState = {
  isLoading: false,
  error: false,
  data: {}
};

export const UPLOAD_INFO_SUCCESS = 'profile/UPLOAD_INFO_SUCCESS';
export const UPLOAD_INFO_LOADING = 'profile/UPLOAD_INFO_LOADING';
export const UPLOAD_INFO_ERROR = 'profile/UPLOAD_INFO_ERROR';

export const changeInfo = (id, photo, name, password) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: UPLOAD_INFO_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: UPLOAD_INFO_LOADING,
    });
    const data = {
      id: id,
      avatar: photo ? {
        name: photo.fileName,
        type: photo.type,
        data: photo.data,
      } : null,
      name: name,
      password: password
    };
    return ax.post(`${apiConfig.url}profile/info`, data)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: UPLOAD_INFO_SUCCESS,
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
            type: UPLOAD_INFO_ERROR,
            payload: result
          });
          return result;
        });
  };
};

const editProfileState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case UPLOAD_INFO_SUCCESS:
      return {
        isLoading: false,
        data: action.payload
      };
    case UPLOAD_INFO_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UPLOAD_INFO_ERROR:
      return {
        isLoading: false,
        data: action.payload
      };
    default: {
      return state;
    }
  }
};

export default editProfileState;
