import React, {Component} from 'react';
import {
    View, SafeAreaView
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import SplashScreen from "react-native-splash-screen";
import BackgroundGeolocation from "react-native-background-geolocation";
import LargeButton from "../../components/largeButton/largeButton";
import i18nService from "../../utils/i18n/i18nService";
import ax from "../../utils/axios";
import userService from "../../utils/userService";
import asyncStorageService from "../../utils/asyncStorageService";
import userKeys from "../../constants/userKeys";
import ImagePicker from 'react-native-image-picker';
import imageCacheHoc from 'react-native-image-cache-hoc';
import LinearGradient from "react-native-linear-gradient";
import EditPage from "../../components/editPage/editPage";
import {Image, Text} from 'react-native-elements';

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
});


export default class EditProfileView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: null,
            tracking: false,
            initialized: false,
            geoLocationReady: false,
            sourceDisplaying: null
        };
    }

    componentDidMount() {
        this.initialize();

        this.options = {
            title: i18nService.t('select_avatar'),
            cancelButtonTitle: i18nService.t('cancel'),
            takePhotoButtonTitle: i18nService.t('take_photo'),
            chooseFromLibraryButtonTitle: i18nService.t('choose_from_gallery'),
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
    }

    async initialize() {
        this.user = await userService.getUser();
        // 1.  Wire up event-listeners

        BackgroundGeolocation.ready({
            reset: true,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 100,
            // Activity Recognition
            stopTimeout: 1,
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url: `${ax.defaults.baseURL}/location/?id=${this.user.id}`,
            batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: {              // <-- Optional HTTP headers
                ...ax.defaults.headers.common
            },
            params: {               // <-- Optional HTTP params
                                    // 'id': this.user.id
            }
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
            this.setState({
                geoLocationReady: true
            });
            if (!state.enabled) {
                BackgroundGeolocation.start(function () {
                    console.log("- Start geo success");
                });
            }
        });
        this.setState({
            initialized: true,
            tracking: this.user.tracking,
        });
        SplashScreen.hide();
    }

    componentWillMount() {
        BackgroundGeolocation.onLocation(this.onLocation, this.onError);
        BackgroundGeolocation.onProviderChange(this.onProviderChange);
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
            data,
            uploadAvatar
        } = this.props;
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                {
                    this.state.initialized ?
                        <EditPage onPress={() => {}} /> : null
                }
                {
                    this.state.initialized ?
                        <View style={sharedStyles.centredColumn}>
                            <View style={{width: '90%'}}>
                                <Image />
                                <Text h4>{this.user.name}</Text>
                                <LargeButton type={this.state.tracking ? 'outline' : 'solid'}
                                             title={i18nService.t(this.state.tracking ? 'stop_tracking' : 'start_tracking')}
                                             loading={!this.state.initialized || !this.state.geoLocationReady}
                                             onPress={async () => {
                                                 if (!this.state.initialized || !this.state.geoLocationReady) {
                                                     return;
                                                 }
                                                 if (this.state.tracking) {
                                                     BackgroundGeolocation.removeListeners();
                                                     BackgroundGeolocation.stop(function () {
                                                         console.log("- Stop geo success");
                                                     });
                                                 } else {
                                                     BackgroundGeolocation.onLocation(this.onLocation, this.onError);
                                                     BackgroundGeolocation.onProviderChange(this.onProviderChange);
                                                     BackgroundGeolocation.start(function () {
                                                         console.log("- Start geo success");
                                                     });
                                                 }
                                                 const tracking = !this.state.tracking;
                                                 await asyncStorageService.setItem(userKeys.TRACKING_KEY, tracking.toString());
                                                 this.setState({
                                                     tracking: tracking
                                                 })
                                             }}>
                                </LargeButton>
                                <LargeButton
                                    title={'Select avatar'}
                                    onPress={() => {
                                        ImagePicker.showImagePicker(this.options, async (response) => {
                                            console.log('Response = ', response);

                                            if (response.didCancel) {
                                                console.log('User cancelled image picker');
                                            } else if (response.error) {
                                                console.log('ImagePicker Error: ', response.error);
                                            } else if (response.customButton) {
                                                console.log('User tapped custom button: ', response.customButton);
                                            } else {
                                                const source = {uri: response.uri};
                                                const sourceDisplaying = {uri: 'data:image/jpeg;base64,' + response.data};

                                                this.setState({
                                                    avatarSource: source,
                                                    sourceDisplaying: sourceDisplaying
                                                });

                                                const uploadedPhoto = await uploadAvatar(this.user.id, response);
                                            }
                                        });
                                    }}>
                                </LargeButton>
                                {
                                    this.state.sourceDisplaying ?
                                        <Image style={{ width: 150, height: 150}}
                                               source={this.state.sourceDisplaying}>
                                        </Image>
                                        : null
                                }
                            </View>

                        </View> : null
                }
            </SafeAreaView>
            </LinearGradient>
        );
    }
}
