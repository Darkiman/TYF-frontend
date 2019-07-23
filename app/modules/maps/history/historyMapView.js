import React, {Component} from 'react';
import {StyleSheet, Animated, View, Easing, Platform,} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {Icon} from 'react-native-elements';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import iconsService from "../../../utils/iconsService";
import IconsType from "../../../constants/IconsType";
import themeService from "../../../utils/themeService";
import userService from "../../../utils/userService";
import mapStyle from './../mapStyle';
import PermissionsService from "../../../utils/permissionsService";
import FlashMessage from "react-native-flash-message";
import messageService from "../../../utils/messageService";
import i18nService from "../../../utils/i18n/i18nService";
import commonFunctionsService from '../../../utils/commonFunctionsService';

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

export default class HistoryMapView extends Component {
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
            history: [],
            refreshingRotate: new Animated.Value(0),
        };
        this.region = null;
        this.markers = {};
        this.contactId = this.props.navigation.getParam('contactId');
    }

    componentDidMount() {
        this.initialize();
        this.getCurrentPosition();
        // AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this.handleAppStateChange);
        if (this.watchId) {
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
            if (!this.state.refreshing) {
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
        this.user = await userService.getUser();
        try {
            const result = await this.props.getContactHistory(this.user.id, this.contactId);
            if (result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
                this.setState({
                    refreshing: true
                });
            } else {
                this.loadedImagesCount = 0;
                this.setState({
                    history: result.source.history,
                });
            }
        } catch (e) {
            messageService.showError(this.refs.flashMessage, i18nService.t(`validation_message.server_is_not_available`));
            this.setState({
                history: [],
            });
        }
        this.loadedImagesCount = 0;
        this.setState({
            refreshingRotate: new Animated.Value(0),
        });
    }


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
        if (!locationEnabled && Platform.OS === 'ios') {
            locationEnabled = await PermissionsService.isWhenInUseLocationPermissionEnabled();
        }
        if (locationEnabled) {
            if (!this.watchId) {
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
                } catch (e) {
                    alert(e.message || "");
                }
            } else {
                this.setState({
                    region: this.region
                });
                this.setRegion(this.region);
            }
        } else {
            PermissionsService.enableGeoLocation('see_you_position_on_map');
        }
    };

    setRegion(region) {
        if (this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
    }

    onMapReady = (e) => {
        if (!this.state.ready) {
            this.setState({
                ready: true
            });
            if (!this.state.region) {
                this.getCurrentPosition();
            }
        }
    };

    onRefresh = async () => {
        if (this.state.startAnimation) {
            return;
        }
        this.setState({
            refreshing: true,
            startAnimation: true
        });
        const keys = Object.keys(this.markers);
        for (let key of keys) {
            this.markers[key].hideCallout();
        }
        this.startAnimation();
        try {
            if (!this.user || !this.user.id) {
                this.user = await userService.getUser();
            }
            const result = await this.props.getContactHistory(this.user.id, this.contactId);
            if (result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
                this.setState({
                    tracksViewChanges: true,
                    refreshing: true,
                });
            } else {
                this.setState({
                    history: result.source.history,
                    tracksViewChanges: true,
                    refreshing: true,
                });
            }
        } catch (e) {
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

    convertCoords(coords) {
        return {latitude: coords._latitude, longitude: coords._longitude}
    }

    back = () => {
        this.props.navigation.goBack();
    };

    render() {
        const {region, history, tracksViewChanges} = this.state;
        const {children} = this.props;

        const {
            isLoading,
            error,
            data
        } = this.props;

        const spin = this.state.refreshingRotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });


        const historyCoordinates = history.map(item => {
            return commonFunctionsService.convertCoords(item.coords);
        });

        let lineGradient = ['#6bddf2'];
        if(historyCoordinates && historyCoordinates.length >= 2) {
            lineGradient = commonFunctionsService.createLineGradient(historyCoordinates.length);
        }

        return (
            <View style={sharedStyles.safeView}>
                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        ref={map => {
                            this.map = map
                        }}
                        initialRegion={region}
                        onMapReady={this.onMapReady}
                        showsMyLocationButton={false}
                        style={styles.map}
                        customMapStyle={mapStyle}
                    >
                        {
                            <Polyline
                                coordinates={historyCoordinates}
                                strokeColor="#6bddf2" // fallback for when `strokeColors` is not supported by the map-provider
                                strokeColors={lineGradient}
                                strokeWidth={3}
                            />
                        }
                        {
                            historyCoordinates && historyCoordinates.map((item, index) => {
                                return <Marker key={index}
                                               coordinate={item}>
                                </Marker>

                            })
                        }
                    </MapView>

                </View>
                <Icon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-arrow-back`}
                      size={35}
                      color={colors.color}
                      underlayColor={'transparent'}
                      containerStyle={{
                          position: 'absolute',
                          top: '7%',
                          left: 16,
                          backgroundColor: 'transparent'
                      }}
                      onPress={this.back}
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
                              style={{transform: [{rotate: spin}]}}
                              color={this.state.startAnimation ? colors.color : '#666'}
                              underlayColor={'transparent'}
                              onPress={this.onRefresh}
                />
                <FlashMessage position="top" ref={'flashMessage'}/>
            </View>
        );
    }
}
