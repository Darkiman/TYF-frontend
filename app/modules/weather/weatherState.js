export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR';
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';

const initialState = {
  weatherInfo: {},
  isLoading: false,
  error: false,
};


export const getWeatherSelector = (state: Object) => ({ ...state.weather });

const weatherState = (state: Object = initialState, action: Object) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS: {
      return {
        isLoading: false,
        error: false,
        weatherInfo: action.payload.weatherInfo,
      };
    }
    case FETCH_DATA_REQUEST: {
      return {
        isLoading: true,
        error: false,
        weatherInfo: {},
      };
    }
    case FETCH_DATA_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    default: {
      return state;
    }
  }
};

export default weatherState;
