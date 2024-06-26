import React, { Component } from 'react';
import {StyleSheet, Animated, View, SafeAreaView, Easing, Platform, AppState} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {Icon} from 'react-native-elements';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import ContactMarker from "../../components/contactMarker/contactMarker";
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import themeService from "../../utils/themeService";
import userService from "../../utils/userService";
import ContactMarkerCallout from "../../components/contactMarketCallout/contactMarkerCallout";
import firebase from 'react-native-firebase';
import mapStyle from './mapStyle';
import PermissionsService from "../../utils/permissionsService";
import NavigationRoutes from "../../constants/NavigationRoutes";
import {NavigationEvents} from "react-navigation";
import FlashMessage from "react-native-flash-message";
import messageService from "../../utils/messageService";
import i18nService from "../../utils/i18n/i18nService";
import NotificationParserService from "../../utils/notificationParserService";
import commonFunctionsService from "../../utils/commonFunctionsService";

const colors = themeService.currentThemeColors;

const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const styles = StyleSheet.create({
    mapContainer: {
        position: 'relative',
        height: '100%'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default class MapsView extends Component {
    constructor(props) {
        super(props);

        this.map = null;
        this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            region: null,
            ready: false,
            tracksViewChanges: true,
            refreshing: false,
            startAnimation: false,
            contacts: [],
            refreshingRotate: new Animated.Value(0),
        };
        this.region = null;
        this.markers = {};
        this.notificationTimeStamp = false;
    }

    componentDidMount() {
        this.initialize();
        this.getCurrentPosition();
        // AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this.handleAppStateChange);
        if(this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    }

    startAnimation = () => {
        this.state.refreshingRotate.setValue(0);
        Animated.timing(
            this.state.refreshingRotate,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => {
                if(!this.state.refreshing) {
                    this.startAnimation();
                } else {
                    this.setState({
                        startAnimation: false,
                        tracksViewChanges: false,
                        refreshing: false
                    })
                }
            })
    };


    async initialize() {
        NotificationParserService.mapsNotificationHandler = this.handleNotification;
        this.user = await userService.getUser();
        try {
            const result = await this.props.getContactsPosition(this.user.id);
            if(result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
                this.setState({
                    refreshing: true
                });
            } else {
                this.loadedImagesCount = 0;
                this.setState({
                    contacts: result.source.positions,
                });
            }
        } catch (e) {
            messageService.showError(this.refs.flashMessage, i18nService.t(`validation_message.server_is_not_available`));
            this.setState({
                contacts: [],
            });
        }
        this.loadedImagesCount = 0;
        this.setState({
            refreshingRotate: new Animated.Value(0),
        });
    }

    handleNotification = async (params) => {
        const {key} = params;
        await this.onRefresh();
        for(let contact of this.state.contacts) {
            console.log(contact.data);
            if(contact.data && contact.key && contact.key === key) {
                this.setRegion({
                    ...commonFunctionsService.convertCoords(contact.data.geoPosition.coords),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                });
                break;
            }
        }
    };

    handlePosition = (position) => {
         this.region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
    };

    getCurrentPosition = async () => {
        let locationEnabled = await PermissionsService.isLocationPermissionEnabled();
        if(!locationEnabled && Platform.OS === 'ios') {
            locationEnabled = await PermissionsService.isWhenInUseLocationPermissionEnabled();
        }
        if (locationEnabled) {
            if(!this.watchId) {
                this.watchId = navigator.geolocation.watchPosition(this.handlePosition);
                try {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const region = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            };
                            this.setState({
                                region: region
                            });
                            this.setRegion(region);
                        },
                        (error) => {
                            alert(error);
                        }
                    );
                } catch(e) {
                    alert(e.message || "");
                }
            } else {
                this.setState({
                    region: this.region
                });
                this.setRegion(this.region);
            }
        } else {
            // this.props.navigation.navigate(NavigationRoutes.HOME);
            PermissionsService.enableGeoLocation('see_you_position_on_map');
        }
    };

    setRegion(region) {
        if(this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
    }

    onMapReady = (e) => {
        if(!this.state.ready) {
            this.setState({
                ready: true
            });
            if(!this.state.region) {
                this.getCurrentPosition();
            }
        }
    };

    onImageLoad = () => {
       this.loadedImagesCount++;
       if(this.loadedImagesCount >= this.state.contacts.length) {
           this.loadedImagesCount = 0;
           this.setState({
               tracksViewChanges: false
           });
       }
    };

    onRefresh = async () => {
        if(this.state.startAnimation) {
            return;
        }
        this.setState({
            refreshing: true,
            startAnimation: true
        });
        const keys = Object.keys(this.markers);
        for(let key of keys) {
            this.markers[key].hideCallout();
        }
        this.startAnimation();
        try {
            if(!this.user || !this.user.id) {
                this.user = await userService.getUser();
            }
            const result = await this.props.getContactsPosition(this.user.id);
            if(result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
                this.setState({
                    tracksViewChanges: true,
                    refreshing: true,
                });
            } else {
                this.setState({
                    contacts: result.source.positions,
                    tracksViewChanges: true,
                    refreshing: true,
                });
            }
        }
        catch (e) {
            console.log(e);
            messageService.showError(this.refs.flashMessage, i18nService.t(`validation_message.server_is_not_available`));
            this.setState({
                tracksViewChanges: true,
                refreshing: true,
            });
        }
    };

    toCurrentPosition = () => {
        this.getCurrentPosition();
    };

    onFocus = async () => {
        try {
            NotificationParserService.mapsNotificationHandler = this.handleNotification;
            const {navigation} = this.props;
            const key = navigation.getParam('key');
            const notificationTimeStamp = navigation.getParam('timeStamp');
            if(key && notificationTimeStamp !== this.notificationTimeStamp) {
                this.notificationTimeStamp = notificationTimeStamp;
                this.handleNotification({key});
            }
        } finally {
            this.props.navigation.navigate(NavigationRoutes.MAPS);
        }
    };

    onBlur = async () => {
        NotificationParserService.mapsNotificationHandler = null;
    };

    render() {
        const { region, contacts, tracksViewChanges } = this.state;
        const { children } = this.props;

        const {
            isLoading,
            error,
            data
        } = this.props;

        const spin = this.state.refreshingRotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        const unitId =
            Platform.OS === 'ios'
                ? 'ca-app-pub-4318279887762361/7843050671'
                : 'ca-app-pub-4318279887762361/6126698221';
        const Banner = firebase.admob.Banner;
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();

        return (
            <View style={sharedStyles.safeView}>
                <NavigationEvents
                    onWillFocus={payload => {
                        this.onFocus();
                    }}
                    onWillBlur={payload => {
                        this.onBlur();
                    }}
                />
                <View style={styles.mapContainer}>
                    <MapView
                        showsUserLocation
                        provider={PROVIDER_GOOGLE}
                        ref={ map => { this.map = map }}
                        initialRegion={region}
                        onMapReady={this.onMapReady}
                        showsMyLocationButton={false}
                        style={styles.map}
                        customMapStyle={mapStyle}
                    >
                        {
                            contacts && contacts.map(item => {
                                if(!item.data || !item.data.geoPosition) {
                                    return null;
                                } else {
                                    return <Marker key={item.key}
                                                   ref={ref => this.markers[item.key] = ref}
                                                   tracksViewChanges={tracksViewChanges}
                                                   coordinate={commonFunctionsService.convertCoords(item.data.geoPosition.coords)}>
                                        <ContactMarker data={item.data}
                                                       onLoad={this.onImageLoad}/>
                                        <ContactMarkerCallout data={item.data}/>
                                    </Marker>
                                }
                            })
                        }
                    </MapView>

                </View>
                <Icon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-compass`}
                      size={50}
                      containerStyle={{
                          position: 'absolute',
                          top: '50%',
                          right: '5%',
                          backgroundColor: 'transparent'
                      }}
                      color={ '#666'}
                      underlayColor={'transparent'}
                      onPress={this.toCurrentPosition}
                />
                <AnimatedIcon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-refresh-circle`}
                      size={50}
                      containerStyle={{
                          position: 'absolute',
                          bottom: '4%',
                          right: '5%',
                          backgroundColor: 'transparent'
                      }}
                      style={{ transform: [{rotate: spin}]}}
                      color={ this.state.startAnimation ? colors.color : '#666'}
                      underlayColor={'transparent'}
                      onPress={this.onRefresh}
                />
                {/*<Banner*/}
                {/*    unitId={unitId}*/}
                {/*    size={'SMART_BANNER'}*/}
                {/*    request={request.build()}*/}
                {/*    onAdLoaded={() => {*/}
                {/*        console.log('Advert loaded');*/}
                {/*    }}*/}
                {/*/>*/}
                <FlashMessage position="top" ref={'flashMessage'}/>
            </View>
        );
    }
}
