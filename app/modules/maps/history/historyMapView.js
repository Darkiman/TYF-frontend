import React, {Component} from 'react';
import {StyleSheet, Animated, View, Easing, Platform, SafeAreaView,} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {Icon, ListItem, Text} from 'react-native-elements';
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
import ModalOverlay from "../../../components/overlay/overlay";
import LocationCallout from "../../../components/locationCallout/locationCallout";

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
    switchContainer: {
        height: 60,
        paddingRight: 0,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        margin: 0
    },
    switchTitle: {
        fontSize: 18,
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

            showOptions: false,
            showLines: false,
            showMarkers: false
        };
        this.region = null;
        this.markers = {};
        this.contactId = this.props.navigation.getParam('contactId');
    }

    componentDidMount() {
        this.initialize();
        // AppState.addEventListener('change', this.handleAppStateChange);
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
        if (this.user.historyOptions) {
            const {historyOptions} = this.user;
            this.setState({
                showLines: historyOptions.showLines,
                showMarkers: historyOptions.showMarkers
            })
        } else {
            this.setState({
                showLines: true
            });
            this.user.historyOptions = {
                showLines: true,
                showMarkers: false
            };
            userService.setUser(this.user);
        }
        try {
            const result = await this.props.getContactHistory(this.user.id, this.contactId);
            if (result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
                this.setState({
                    refreshing: true
                });
            } else {
                const firstPosition = result.source.history[0] ? commonFunctionsService.convertCoords(result.source.history[0].coords) : null;
                const region = {
                    latitude: firstPosition.latitude,
                    longitude: firstPosition.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                };
                this.setRegion(region);
                this.setState({
                    history: result.source.history,
                    region: region
                });
            }
        } catch (e) {
            messageService.showError(this.refs.flashMessage, i18nService.t(`validation_message.server_is_not_available`));
            this.setState({
                history: [],
            });
        }
        this.setState({
            refreshingRotate: new Animated.Value(0),
        });
    }


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

    back = () => {
        this.props.navigation.goBack();
    };

    showOptions = () => {
        this.setState({
            showOptions: true
        })
    };

    handleShowLinesChange = (value) => {
        this.setState({
            showLines: value
        });
        this.user.historyOptions.showLines = value;
        userService.setUser(this.user);
    };

    handleShowMarkersChange = (value) => {
        this.setState({
            showMarkers: value
        });
        this.user.historyOptions.showMarkers = value;
        userService.setUser(this.user);
    };

    render() {
        const {region, history, showOptions, showLines, showMarkers} = this.state;
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
            return {
                date: item.date,
                coords: commonFunctionsService.convertCoords(item.coords)
            };
        });

        const lines = [];
        for (let i = 0; i < historyCoordinates.length - 1; i++) {
            let lineGradient = ['#6bddf2'];
            if (historyCoordinates && historyCoordinates.length >= 2) {
                lineGradient = commonFunctionsService.createLineGradient(historyCoordinates.length);
            }
            lines.push(<Polyline
                coordinates={[historyCoordinates[i].coords, historyCoordinates[i + 1].coords]}
                strokeColor={lineGradient[i]}
                strokeColors={lineGradient}
                strokeWidth={3}
            />);
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
                        {showLines ? lines : null}
                        {
                            showMarkers && historyCoordinates && historyCoordinates.map((item, index) => {
                                return <Marker key={index}
                                               pinColor={'linen'}
                                               coordinate={item.coords}>
                                    <LocationCallout date={item.date}></LocationCallout>
                                </Marker>

                            })
                        }
                    </MapView>

                </View>
                <Icon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-settings`}
                      size={35}
                      color={'#666'}
                      underlayColor={'transparent'}
                      containerStyle={{
                          position: 'absolute',
                          top: '7%',
                          right: 16,
                          backgroundColor: 'transparent'
                      }}
                      onPress={this.showOptions}
                />
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
                <ModalOverlay
                    isVisible={showOptions}
                    containerStyle={{paddingTop: 0, paddingBottom: 0}}
                    onBackdropPress={() => {
                        this.setState({
                            showOptions: !showOptions
                        })
                    }}>
                    <ListItem
                        containerStyle={styles.switchContainer}
                        titleStyle={styles.switchTitle}
                        title={i18nService.t('show_lines')}
                        switch={{
                            onValueChange: this.handleShowLinesChange,
                            value: showLines
                        }}
                    />
                    <ListItem
                        containerStyle={styles.switchContainer}
                        titleStyle={styles.switchTitle}
                        title={i18nService.t('show_markers')}
                        switch={{
                            onValueChange: this.handleShowMarkersChange,
                            value: showMarkers
                        }}
                    />
                </ModalOverlay>
                <FlashMessage position="top" ref={'flashMessage'}/>
            </View>
        );
    }
}
