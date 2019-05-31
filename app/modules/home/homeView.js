import React, {Component} from 'react';
import {
    View, SafeAreaView, Platform
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
import {Icon, Image, Text} from 'react-native-elements';
import IconsType from "../../constants/IconsType";
import themeService from "../../utils/themeService";
import iconsService from "../../utils/iconsService";
import NavigationRoutes from "../../constants/NavigationRoutes";
import ProfileImage from "../../components/profileImage/profileImage";

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
});

const colors = themeService.currentThemeColors;
const styles = {
    view: {
        height: '100%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        marginBottom: 71
    }
};

export default class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: null,
            tracking: false,
            initialized: false,
            geoLocationReady: false,
            sourceDisplaying: null
        };

        this.iconPrefix = iconsService.getIconPrefix();
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
                        <EditPage onPress={() => {
                            this.props.navigation.navigate(NavigationRoutes.HOME_PROFILE);
                        }} /> : null
                }
                {
                    this.state.initialized ?
                        <View style={sharedStyles.centredColumn}>
                            <View style={styles.view}>
                                <ProfileImage style={styles.avatar}
                                              user={this.user}>
                                </ProfileImage>
                                <Text h4 style={{...sharedStyles.h4, width: '100%', textAlign: 'center'}}>{this.user.name}</Text>
                                <LargeButton type={this.state.tracking ? 'outline' : 'solid'}
                                             buttonStyle={{marginTop: 70}}
                                             title={i18nService.t(this.state.tracking ? 'stop_tracking' : 'start_tracking')}
                                             icon={<Icon
                                                 type={IconsType.Ionicon}
                                                 name={this.state.tracking ? `${this.iconPrefix}-pause` : `${this.iconPrefix}-play`}
                                                 containerStyle={{position: 'relative', top: 2, marginLeft: 7}}
                                                 size={20}
                                                 color={this.state.tracking ? 'white' : colors.color }
                                                 underlayColor={'transparent'}
                                             />}
                                             buttonText={{width: 'auto'}}
                                             iconRight={true}
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
                            </View>

                        </View> : null
                }
            </SafeAreaView>
            </LinearGradient>
        );
    }
}
