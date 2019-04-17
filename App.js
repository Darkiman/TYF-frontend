import React, {Component} from 'react';
import { Provider } from 'react-redux';

import configureStore from './app/store/configureStore';
import {createStackNavigator} from 'react-navigation';
import {createAppContainer} from 'react-navigation';
import homeContainer from './app/modules/home/homeContainer';
import profileContainer from './app/modules/profile/profileContainer';


const store = configureStore({});
const MainNavigator = createStackNavigator({
    Home: {screen: homeContainer},
    Profile: {screen: profileContainer},
}, {
    initialRouteName: 'Profile',
});

const AppContainer = createAppContainer(MainNavigator);
export default class App extends Component<Props> {
  render() {
    return (
        <Provider store={store}>
          <AppContainer/>
        </Provider>
    );
  }
}
