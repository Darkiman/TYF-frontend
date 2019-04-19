import React from 'react';
import homeContainer from "../home/homeContainer";
import ProfileStackNavigator from "./profileStackNavigator";
import SettingsStackNavigator from "./settingsStackNavigator";
import mapsContainer from "../maps/mapsContainer";

export default mainNavigationScreens = {
    Home: {
        screen: homeContainer
    },
    Maps: {
        screen: mapsContainer
    },
    Profile: ProfileStackNavigator,
    Settings: SettingsStackNavigator,
}
