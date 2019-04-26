import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './app/modules/appNavigation/appNavigation';
import SplashScreen from 'react-native-splash-screen';

import configureStore from './app/store/configureStore';

const store = configureStore({});
export default class App extends Component {

    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigation/>
            </Provider>
        )
    }
}
