import React, { Component } from 'react';
import {StyleSheet, Animated, View, SafeAreaView, Easing, Text} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {Icon} from 'react-native-elements';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import ContactMarker from "../../components/contactMarker/contactMarker";
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import themeService from "../../utils/themeService";
import {getContactsPosition} from "./mapsState";
import userService from "../../utils/userService";
import ContactMarkerCallout from "../../components/contactMarketCallout/contactMarkerCallout";

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
    }

    componentDidMount() {
        this.initialize();
        this.getCurrentPosition();
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
                        tracksViewChanges: false
                    })
                }
            })
    };


    async initialize() {
        this.user = await userService.getUser();
        const result = await this.props.getContactsPosition(this.user.id);
        this.loadedImagesCount = 0;
        this.setState({
            refreshingRotate: new Animated.Value(0),
            contacts: result.source.positions,
        });
    }

    getCurrentPosition() {
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
            this.getCurrentPosition();
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
        this.startAnimation();
        const result = await this.props.getContactsPosition(this.user.id);
        this.setState({
            contacts: result.source.positions,
            tracksViewChanges: true,
            refreshing: true,
        });
    };

    toCurrentPosition = () => {
        this.getCurrentPosition();
    };

    convertCoords(coords) {
        return {latitude : coords._latitude, longitude: coords._longitude}
    }

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

        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={styles.mapContainer}>
                    <MapView
                        showsUserLocation
                        provider={PROVIDER_GOOGLE}
                        ref={ map => { this.map = map }}
                        initialRegion={region}
                        onMapReady={this.onMapReady}
                        showsMyLocationButton={false}
                        style={styles.map}
                    >
                        {
                            contacts && contacts.map(item => {
                                if(!item.data || !item.data.geoPosition) {
                                    return null;
                                } else {
                                    return <Marker key={item.key}
                                                   tracksViewChanges={tracksViewChanges}
                                                   coordinate={this.convertCoords(item.data.geoPosition.coords)}>
                                        <ContactMarker data={item.data}
                                                       onLoad={this.onImageLoad}/>
                                        <ContactMarkerCallout data={item.data}></ContactMarkerCallout>
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
            </SafeAreaView>
        );
    }
}
