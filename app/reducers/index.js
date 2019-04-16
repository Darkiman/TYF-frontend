import { combineReducers } from 'redux';
import weatherState from '../modules/weather/weatherState';

// Root Reducer
const rootReducer = combineReducers({
  weather: weatherState,
});

export default rootReducer;
