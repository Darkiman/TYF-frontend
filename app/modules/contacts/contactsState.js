import networkService from "../../utils/networkService";
import ax from "../../utils/axios";

const initialState = {
  data: {},
  isLoading: false,
  error: false,
  contacts: []
};


export const GET_CONTACTS_SUCCESS = 'contracts/GET_CONTACTS_SUCCESS';
export const GET_CONTACTS_LOADING = 'contracts/GET_CONTACTS_LOADING';
export const GET_CONTACTS_ERROR = 'contracts/GET_CONTACTS_ERROR';


export const DELETE_CONTACT_SUCCESS = 'contracts/DELETE_CONTACT_SUCCESS';
export const DELETE_CONTACT_LOADING = 'contracts/DELETE_CONTACT_LOADING';
export const DELETE_CONTACT_ERROR = 'contracts/DELETE_CONTACT_ERROR';

export const ADD_CONTACT_SUCCESS = 'contracts/ADD_CONTACT_SUCCESS';
export const ADD_CONTACT_LOADING = 'contracts/ADD_CONTACT_LOADING';
export const ADD_CONTACT_ERROR = 'contracts/ADD_CONTACT_ERROR';

export const CHANGE_CONTACT_OPTIONS = 'contracts/CHANGE_CONTACT_OPTIONS';

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
            type: GET_CONTACTS_ERROR,
            payload: result
          });
          return result;
        });
  };
};

export const addContact = (id, idToAdd ) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: ADD_CONTACT_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: ADD_CONTACT_LOADING,
    });
    const data = {
      id: id,
      idToAdd: idToAdd
    };
    return ax.post(`contacts/`, data)
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: ADD_CONTACT_SUCCESS,
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
            type: ADD_CONTACT_ERROR,
            payload: result
          });
          return result;
        });
  };
};


export const deleteContact = (id, idToDelete) => {
  return dispatch => {
    if(!networkService.isConnected) {
      dispatch({
        type: DELETE_CONTACT_ERROR,
        payload: { data: 'internet_connection_not_available' }
      });
      return;
    }
    dispatch({
      type: DELETE_CONTACT_LOADING,
    });
    const data = {
      id: id,
      idToDelete: idToDelete
    };
    return ax.delete(`contacts/`, {data :data})
        .then(({data}) => {
          const result = {
            source: data,
            error: false
          };
          dispatch({
            type: DELETE_CONTACT_SUCCESS,
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
            type: DELETE_CONTACT_ERROR,
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
        contacts: action.payload.contacts
      };
    case GET_CONTACTS_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true,
        contacts: state.contacts
      };
    case GET_CONTACTS_ERROR:
      return {
        isLoading: false,
        error: true,
        contacts: action.payload.contacts
      };
    case DELETE_CONTACT_SUCCESS:
      const item = state.contacts.find(item => item.key === action.payload.contact);
      const index = state.contacts.indexOf(item);
      state.contacts.splice(index, 1);
      return {
        isLoading: false,
        error: false,
        data: action.payload,
        contacts: state.contacts
      };
    case DELETE_CONTACT_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true,
        contacts: state.contacts
      };
    case DELETE_CONTACT_ERROR:
      return {
        isLoading: false,
        error: true,
        data: action.payload,
        contacts: state.contacts
      };
    case ADD_CONTACT_SUCCESS:
      state.contacts.push(action.payload.contact);
      return {
        isLoading: false,
        error: false,
        data: action.payload,
        contacts: state.contacts
      };
    case ADD_CONTACT_LOADING:
      return {
        ...state,
        error: false,
        isLoading: true,
        contacts: state.contacts
      };
    case ADD_CONTACT_ERROR:
      return {
        isLoading: false,
        error: true,
        data: action.payload,
        contacts: state.contacts
      };
    case CHANGE_CONTACT_OPTIONS:
      let contact = state.contacts.find(item => item.key === action.payload.id);
      if(contact) {
        contact.data.options = action.payload.data.options;
      }
      return {
        isLoading: false,
        error: false,
        data: action.payload,
        contacts: state.contacts
      };
    default: {
      return state;
    }
  }
};

export default contactsState;
