import { combineReducers } from 'redux';
import homeSate from '../modules/home/homeState';
import profileState from '../modules/profile/profileState';
import profileDataState from '../modules/profile/data/profileDataState';
import settingsState from '../modules/settings/settingsState';
import languageState from '../modules/settings/language/languageState';
import aboutState from '../modules/settings/about/aboutState';
import authState from '../modules/auth/authState';
import loginState from '../modules/auth/login/loginState';
import signupState from '../modules/auth/signup/signupState';
import contactsState from '../modules/contacts/contactsState';

// Root Reducer
const rootReducer = combineReducers({
  home: homeSate,
  profile: profileState,
  profileData: profileDataState,
  settings: settingsState,
  language: languageState,
  about: aboutState,
  auth: authState,
  login: loginState,
  signupState: signupState,
  contactsState: contactsState
});

export default rootReducer;
