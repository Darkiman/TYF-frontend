import React, { Component } from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
    View, SafeAreaView,
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import ContactMarker from "../../components/contactMarker/contactMarket";

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const initialRegion = {
    latitude: 37.4219983,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

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

        this.state = {
            region: {
                latitude: -37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            ready: true,
            filteredMarkers: [],
            refreshing: false
        };
    }

    setRegion(region) {
        if(this.state.ready) {
            setTimeout(() => this.map.animateToRegion(region), 10);
        }
    }

    componentDidMount() {
        this.getCurrentPosition();
    }

    getCurrentPosition() {
        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // const region = {
                    //     latitude: position.coords.latitude,
                    //     longitude: position.coords.longitude,
                    //     latitudeDelta: LATITUDE_DELTA,
                    //     longitudeDelta: LONGITUDE_DELTA,
                    // };
                    const region = initialRegion;
                    this.setRegion(region);
                },
                (error) => {
                    switch (error.code) {
                        case 1:
                            if (Platform.OS === "ios") {
                                alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización");
                            } else {
                                alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización");
                            }
                            break;
                        default:
                            alert("", "Error al detectar tu locación");
                    }
                }
            );
        } catch(e) {
            alert(e.message || "");
        }
    };

    onMapReady = (e) => {
        if(!this.state.ready) {
            this.setState({ready: true});
        }
    };

    onRegionChange = (region) => {
        console.log('onRegionChange', region);
    };

    onRegionChangeComplete = (region) => {
        console.log('onRegionChangeComplete', region);
    };

    onRefresh = () => {

    };


    render() {
        const { region } = this.state;
        const { children, renderMarker, markers } = this.props;

        const {
            isLoading,
            error,
            data
        } = this.props;
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={styles.mapContainer}>
                    <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                    >
                    </ScrollView>
                    <MapView
                        showsUserLocation
                        provider={PROVIDER_GOOGLE}
                        ref={ map => { this.map = map }}
                        data={markers}
                        // initialRegion={initialRegion}
                        renderMarker={renderMarker}
                        onMapReady={this.onMapReady}
                        showsMyLocationButton={false}
                        onRegionChange={this.onRegionChange}
                        onRegionChangeComplete={this.onRegionChangeComplete}
                        style={styles.map}
                    >
                        {
                            <Marker coordinate={initialRegion}>
                                <ContactMarker data={{}} />
                            </Marker>
                        }
                    </MapView>
                </View>
            </SafeAreaView>
        );
    }
}
