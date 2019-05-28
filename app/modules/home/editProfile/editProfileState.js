import networkService from "../../utils/networkService";
import ax from "../../utils/axios";
import apiConfig from "../../utils/apiConfig";

const initialState = {
  isLoading: false,
  error: false,
  data: {}
};

export const UPLOAD_AVATAR_SUCCESS = 'profile/UPLOAD_AVATAR_SUCCESS';
export const UPLOAD_AVATAR_LOADING = 'profile/UPLOAD_AVATAR_LOADING';
export const UPLOAD_AVATAR_ERROR = 'profile/UPLOAD_AVATAR_ERROR';

// const createFormData = (photo, body) => {
//   const data = new FormData();
//
//   data.append("photo", {
//     name: photo.fileName,
//     type: photo.type,
//     data: photo.data
//   });
//
//   Object.keys(body).forEach(key => {
//     data.append(key, body[key]);
//   });
//
//   return data;
// };

export const uploadAvatar = (id, photo) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: UPLOAD_AVATAR_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: UPLOAD_AVATAR_LOADING,
    });
    const data = {
      id: id,
      name: photo.fileName,
      type: photo.type,
      data: photo.data
    };
    return ax.post(`${apiConfig.url}profile/avatar`, data)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: UPLOAD_AVATAR_SUCCESS,
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
            type: UPLOAD_AVATAR_ERROR,
            payload: result
          });
          return result;
        });
  };
};

const editProfileState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case UPLOAD_AVATAR_SUCCESS:
      return {
        isLoading: false,
        data: action.payload
      };
    case UPLOAD_AVATAR_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UPLOAD_AVATAR_ERROR:
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
