import React, { Component } from 'react';
import { StyleSheet, Animated} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
    View, SafeAreaView,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import ContactMarker from "../../components/contactMarker/contactMarker";
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import themeService from "../../utils/themeService";
import {getContactsPosition} from "./mapsState";
import userService from "../../utils/userService";

const colors = themeService.currentThemeColors;

const initialRegion = {
    latitude: 59.866342,
    longitude: 30.379782,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;


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
            region: {
                latitude: 59.866342,
                longitude: 30.379782,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            ready: false,
            tracksViewChanges: true,
            refreshing: false,
            contacts: []
        };
    }

    componentDidMount() {
        this.getCurrentPosition();
        this.initialize();
    }

    async initialize() {
        this.user = await userService.getUser();
        const result = await this.props.getContactsPosition(this.user.id);
        console.log(result);
        this.setState({
            contacts: result.source.positions,
        });
        setTimeout(() => {
            this.setState({
                tracksViewChanges: false,
            });
        }, 100);
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
                    // const region = initialRegion;
                    this.setRegion(region);
                },
                (error) => {
                    alert("", "Error al detectar tu locación");
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
        }
    };

    onRefresh = async () => {
        this.setState({
            refreshing: true
        });
        this.props.getContactsPosition(this.user)
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
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={styles.mapContainer}>
                    <MapView
                        showsUserLocation
                        provider={PROVIDER_GOOGLE}
                        ref={ map => { this.map = map }}
                        initialRegion={initialRegion}
                        onMapReady={this.onMapReady}
                        showsMyLocationButton={false}
                        style={styles.map}
                    >
                        {
                            contacts && contacts.map(item => {
                                if(!item.data || !item.data.geoPosition) {
                                    return null;
                                } else {
                                    return <Marker key={item.key} tracksViewChanges={tracksViewChanges} coordinate={this.convertCoords(item.data.geoPosition.coords)}>
                                        <ContactMarker data={item.data} />
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
                <Icon type={IconsType.Ionicon}
                      name={`${this.iconPrefix}-refresh-circle`}
                      size={50}
                      containerStyle={{
                          position: 'absolute',
                          bottom: '4%',
                          right: '5%',
                          backgroundColor: 'transparent'
                      }}
                      color={ this.state.refreshing ? colors.color : '#666'}
                      underlayColor={'transparent'}
                      onPress={this.onRefresh}
                />
            </SafeAreaView>
        );
    }
}
