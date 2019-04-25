import { combineReducers } from 'redux';
import weatherState from '../modules/weather/weatherState';
import homeSate from '../modules/home/homeState';
import profileState from '../modules/profile/profileState';
import profileDataState from '../modules/profile/data/profileDataState';
import settingsState from '../modules/settings/settingsState';
import languageState from '../modules/settings/language/languageState';
import aboutState from '../modules/settings/about/aboutState';

// Root Reducer
const rootReducer = combineReducers({
  weather: weatherState,
  home: homeSate,
  profile: profileState,
  profileData: profileDataState,
  settings: settingsState,
  language: languageState,
  about: aboutState
});

export default rootReducer;
