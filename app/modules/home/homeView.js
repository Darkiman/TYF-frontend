import React, {Component} from 'react';
import {
    View, SafeAreaView,
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import SplashScreen from "react-native-splash-screen";
import BackgroundGeolocation from "react-native-background-geolocation";
import LargeButton from "../../components/largeButton/largeButton";
import i18nService from "../../utils/i18n/i18nService";
import ax from "../../utils/axios";
import userService from "../../utils/userService";

export default class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: null,
            tracking: false,
        };
    }

    componentDidMount() {
        this.initialize();
    }

    async initialize() {
        this.user = await userService.getUser();
        // 1.  Wire up event-listeners
        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.onLocation(this.onLocation, this.onError);

        // This event fires when the user toggles location-services authorization
        BackgroundGeolocation.onProviderChange(this.onProviderChange);

        BackgroundGeolocation.ready({
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 100,
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url: `${ax.defaults.baseURL}/location/?id=${this.user.id}` ,
            batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: {              // <-- Optional HTTP headers
                ...ax.defaults.headers.common
            },
            params: {               // <-- Optional HTTP params
                "auth_token": "maybe_your_server_authenticates_via_token_YES?"
            }
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

            if (!state.enabled) {
                // 3. Start tracking!
                BackgroundGeolocation.start(function () {
                    console.log("- Start success");
                });
            }
        });
        SplashScreen.hide();
    }

    componentWillMount() {

    }

    // You must remove listeners when your component unmounts
    componentWillUnmount() {
        BackgroundGeolocation.removeListeners();
    }

    onLocation(location) {
        // console.log('[location] -', location);
    }

    onError(error) {
        // console.warn('[location] ERROR -', error);
    }

    onProviderChange(provider) {
        // console.log('[providerchange] -', provider.enabled, provider.status);
    }

    render() {
        const {
            isLoading,
            error,
            data
        } = this.props;
        return (
            <SafeAreaView forceInset={{top: 'always'}} style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>

                    <View style={{width: '90%'}}>
                        <LargeButton type={this.state.tracking ? 'outline' : 'solid'}
                                     title={i18nService.t(this.state.tracking ? 'stop_tracking' : 'start_tracking')}
                                     onPress={() => {
                                         this.setState({
                                             tracking: !this.state.tracking
                                         })
                                     }}>
                        </LargeButton>
                    </View>

                </View>
            </SafeAreaView>
        );
    }
}
