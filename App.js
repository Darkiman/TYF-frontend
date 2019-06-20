import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './app/modules/appNavigation/appNavigation';
import firebase from 'react-native-firebase';

import configureStore from './app/store/configureStore';
import networkService from './app/utils/networkService';
import asyncStorageService from "./app/utils/asyncStorageService";
import i18nService from "./app/utils/i18n/i18nService";

const store = configureStore({});
export default class App extends Component {


    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
        networkService.removeNetworkListen();
    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigation/>
            </Provider>
        )
    }
}
