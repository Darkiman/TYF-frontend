import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './app/modules/appNavigation/appNavigation';
import firebase from 'react-native-firebase';

import configureStore from './app/store/configureStore';
import networkService from './app/utils/networkService';
import asyncStorageService from "./app/utils/asyncStorageService";
import SplashScreen from "react-native-splash-screen";

const store = configureStore({});
export default class App extends Component {

    componentDidMount() {
        //SplashScreen.hide();
        this.checkPermission();
        this.createNotificationListeners();
        // this.initialize()
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
        networkService.removeNetworkListen();
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        let fcmToken = await asyncStorageService.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                await asyncStorageService.setItem('fcmToken', fcmToken);
            }
        }
        console.log(fcmToken);
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            console.log('permission rejected');
        }
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log('foreground', notification);
            const { title, body } = notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log('background',notificationOpen);
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log('closed', notificationOpen);
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log(4, JSON.stringify(message));
        });
    }

    showAlert(title, body) {
        console.log(title, body);
    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigation/>
            </Provider>
        )
    }
}
