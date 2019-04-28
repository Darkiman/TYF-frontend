import React, { Component } from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/sharedStyles";
import i18nService from '../../utils/i18n/i18nService';
import Languages from "../../constants/Languages";
import {PermissionsAndroid} from 'react-native';

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
