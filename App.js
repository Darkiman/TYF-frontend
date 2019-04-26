import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigation from './app/modules/appNavigation/appNavigation';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';

import configureStore from './app/store/configureStore';

const store = configureStore({});
export default class App extends Component {

    componentDidMount() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        // console.log("LOG: ", token);
                    })
                    // user has permissions
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            alert("User Now Has Permission")
                        })
                        .catch(error => {
                            // alert("Error", error)
                            // User has rejected permissions
                        }).finally(() => {
                        });
                }

            });
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
