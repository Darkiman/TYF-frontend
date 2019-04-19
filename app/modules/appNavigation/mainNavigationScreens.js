import React from 'react';
import homeContainer from "../home/homeContainer";
import ProfileStackNavigator from "./profileStackNavigator";
import SettingsStackNavigator from "./settingsStackNavigator";

export default mainNavigationScreens = {
    Home: {
        screen: homeContainer
    },
    Profile: ProfileStackNavigator,
    Settings: SettingsStackNavigator
}
