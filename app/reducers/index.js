import { combineReducers } from 'redux';
import homeState from '../modules/home/homeState';
import mapsState from '../modules/maps/mapsState';
import historyMapState from '../modules/maps/history/historyMapState';
import profileState from '../modules/profile/profileState';
import profileDataState from '../modules/profile/data/profileDataState';
import settingsState from '../modules/settings/settingsState';
import confidentialityState from '../modules/settings/confidentiality/confidentialityState';
import languageState from '../modules/settings/language/languageState';
import aboutState from '../modules/settings/about/aboutState';
import authState from '../modules/auth/authState';
import loginState from '../modules/auth/login/loginState';
import signupState from '../modules/auth/signup/signupState';
import contactsState from '../modules/contacts/contactsState';
import editProfileState from '../modules/home/editProfile/editProfileState';
import contactOptionsState from '../modules/contacts/contactOptions/contactOptionsState';

// Root Reducer
const rootReducer = combineReducers({
  home: homeState,
  maps: mapsState,
  historyMap: historyMapState,
  profile: profileState,
  profileData: profileDataState,
  settings: settingsState,
  confidentiality: confidentialityState,
  language: languageState,
  about: aboutState,
  auth: authState,
  loginState: loginState,
  signupState: signupState,
  contactsState: contactsState,
  editProfile: editProfileState,
  contactOptionsState: contactOptionsState
});

export default rootReducer;
