import React, {Component} from 'react';
import {
    View, SafeAreaView, Platform, Alert
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import BackgroundGeolocation from "react-native-background-geolocation";
import LargeButton from "../../components/largeButton/largeButton";
import i18nService from "../../utils/i18n/i18nService";
import ax from "../../utils/axios";
import userService from "../../utils/userService";
import LinearGradient from "react-native-linear-gradient";
import EditPage from "../../components/editPage/editPage";
import {Icon, Text} from 'react-native-elements';
import IconsType from "../../constants/IconsType";
import themeService from "../../utils/themeService";
import iconsService from "../../utils/iconsService";
import NavigationRoutes from "../../constants/NavigationRoutes";
import ProfileImage from "../../components/profileImage/profileImage";
import {NavigationEvents} from "react-navigation";
import firebase from "react-native-firebase";
import networkService from "../../utils/networkService";
import apiConfig from "../../utils/apiConfig";
import OpenSettings from 'react-native-open-settings';
import PermissionsService from '../../utils/permissionsService'

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
            sourceDisplaying: null,
            checkingPermission: false
        };

        this.iconPrefix = iconsService.getIconPrefix();
    }

    componentDidMount() {
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
        this.initialize();
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
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url: `${ax.defaults.baseURL}/location`,
            batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: {              // <-- Optional HTTP headers
                ...ax.defaults.headers.common
            },
            params: {               // <-- Optional HTTP params
                id: this.user.id              // 'id': this.user.id
            }
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
            this.setState({
                geoLocationReady: true
            });
            if (!state.enabled && this.user.tracking) {
                BackgroundGeolocation.start(function () {
                    console.log("- Start geo success");
                });
            }
        });
        this.checkPermission();
        this.createNotificationListeners();

        this.setState({
            initialized: true,
            tracking: this.user.tracking,
        });
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
        const notificationToken = await firebase.messaging().getToken();
        console.log('Notification token: ' + notificationToken);
        if (!this.user.notificationToken || this.user.notificationToken !== notificationToken) {
            try {
                await ax.post(`${apiConfig.url}profile/notificationToken`, {
                    id: this.user.id,
                    notificationToken: notificationToken
                });
                this.user.notificationToken = notificationToken;
                userService.setUser(this.user);
                console.log(notificationToken);
            } catch (e) {
                console.log('error while updating token: ' + e)
            }
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            await PermissionsService.requestGelocationPermission();
            this.getToken();
        } catch (error) {
            console.log('permissions rejected');
        }
    }

    async createNotificationListeners() {
        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log('On notification displayed', notification);
        });
        this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            console.log('On notification', notification);
        });

        this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            console.log('On notification opened', notification);
        });

        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            // Process your message as required
            console.log(RemoteMessage);
        });
    }


    componentWillMount() {
        BackgroundGeolocation.onLocation(this.onLocation, this.onError);
        BackgroundGeolocation.onProviderChange(this.onProviderChange);

        if (this.removeNotificationOpenedListener) {
            this.removeNotificationOpenedListener();
        }
        if (this.removeNotificationListener) {
            this.removeNotificationListener();
        }

        if(this.removeNotificationDisplayedListener) {
            this.removeNotificationDisplayedListener();
        }
        if(this.messageListener) {
            this.messageListener();
        }
        networkService.removeNetworkListen();
    }

    onLocation(location) {
        // console.log('[location] -', location);
    }

    onError(error) {
        // console.warn('[location] ERROR -', error);
    }

    onProviderChange = async (provider) => {
        console.log('[providerchange] -', provider.enabled, provider.status);
        if (!provider.enabled) {
            this.stopTracking();
            this.user.tracking = false;
            this.setState({
                tracking: false
            });
            await userService.setUser(this.user);
        }
    };

    stopTracking = () => {
        BackgroundGeolocation.removeListeners();
        BackgroundGeolocation.stop(function () {
            console.log("- Stop geo success");
        });
    };

    startTracking = () => {
        BackgroundGeolocation.onLocation(this.onLocation, this.onError);
        BackgroundGeolocation.onProviderChange(this.onProviderChange);
        BackgroundGeolocation.start(function () {
            console.log("- Start geo success");
        });
    };

    toggleTracking = async () => {
        if (!this.state.initialized || !this.state.geoLocationReady) {
            return;
        }
        if (this.state.tracking) {
            this.stopTracking();
        } else {
            const locationEnabled = await PermissionsService.isLocationPermissionEnabled();
            if (locationEnabled) {
                this.startTracking();
            } else {
                PermissionsService.enableGeoLocation();
                return;
            }
        }
        const tracking = !this.state.tracking;
        this.user.tracking = tracking;
        await userService.setUser(this.user);
        this.setState({
            tracking: tracking
        })
    };

    afterUserInfoChange = async () => {
        this.user = await userService.getUser();
        this.forceUpdate();
    };

    render() {
        const {
            isLoading,
            error,
            data,
        } = this.props;

        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                    {
                        this.state.initialized ?
                            <EditPage onPress={() => {
                                this.props.navigation.navigate(NavigationRoutes.HOME_PROFILE, {
                                    update: () => {
                                        this.afterUserInfoChange();
                                    }
                                });
                            }}/> : null
                    }
                    {
                        this.state.initialized ?
                            <View style={sharedStyles.centredColumn}>
                                <NavigationEvents
                                    onWillFocus={payload => {
                                        this.forceUpdate();
                                    }}
                                />
                                <View style={styles.view}>
                                    <ProfileImage style={styles.avatar}
                                                  user={this.user}>
                                    </ProfileImage>
                                    <Text h4 style={{
                                        ...sharedStyles.h4,
                                        width: '100%',
                                        textAlign: 'center'
                                    }}>{this.user.name}</Text>
                                    <View style={{width: '100%'}}>
                                        <LargeButton type={this.state.tracking ? 'outline' : 'solid'}
                                                     buttonStyle={{marginTop: 70}}
                                                     titleStyle={{width: 'auto'}}
                                                     title={i18nService.t(this.state.tracking ? 'stop_tracking' : 'start_tracking')}
                                                     icon={<Icon
                                                         type={IconsType.Ionicon}
                                                         name={this.state.tracking ? `${this.iconPrefix}-pause` : `${this.iconPrefix}-play`}
                                                         containerStyle={{position: 'relative', top: 2, marginLeft: 7}}
                                                         size={20}
                                                         color={this.state.tracking ? 'white' : colors.color}
                                                         underlayColor={'transparent'}
                                                     />}
                                                     iconRight={true}
                                                     loading={!this.state.initialized || !this.state.geoLocationReady}
                                                     onPress={async () => {
                                                         this.toggleTracking();
                                                     }}>
                                        </LargeButton>
                                    </View>
                                </View>

                            </View> : null
                    }
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
