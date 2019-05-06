import React, { Component } from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import SplashScreen from "react-native-splash-screen";

export default class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: null
        };

        navigator.geolocation.getCurrentPosition(
            position => {
                const location = JSON.stringify(position);
                this.setState({ location });
            },
            error => {
                 alert(error);
            },
            { enableHighAccuracy: false, timeout: 1000, maximumAge: 1000 }
        );
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    componentWillUnmount() {
        // navigator.geolocation.clearWatch(this.watchId);
    }

    render() {
        const {
            isLoading,
            error,
            data
        } = this.props;
        return (
            <SafeAreaView forceInset={{top:'always'}} style={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage/> : null}
                    <Text>This is Home</Text>
                    <Text>Location: {this.state.location}</Text>
                </View>
            </SafeAreaView>
        );
    }
}
