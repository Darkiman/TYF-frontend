import { combineReducers } from 'redux';
import weatherState from '../modules/weather/weatherState';
import homeSate from '../modules/home/homeState';
import profileState from '../modules/profile/profileState';

// Root Reducer
const rootReducer = combineReducers({
  weather: weatherState,
  home: homeSate,
  profile: profileState
});

export default rootReducer;
