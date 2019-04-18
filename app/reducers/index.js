import { combineReducers } from 'redux';
import weatherState from '../modules/weather/weatherState';
import homeSate from '../modules/home/homeState';
import profileState from '../modules/profile/profileState';
import profileDataState from '../modules/profile/data/profileDataState';

// Root Reducer
const rootReducer = combineReducers({
  weather: weatherState,
  home: homeSate,
  profile: profileState,
  profileData: profileDataState,
});

export default rootReducer;
