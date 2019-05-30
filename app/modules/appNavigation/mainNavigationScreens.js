import React from 'react';
import SettingsStackNavigator from "./settingsStackNavigator";
import mapsContainer from "../maps/mapsContainer";
import ContactsStackNavigator from "./contactsStackNavigator";
import HomeStackNavigator from "./homeStackNavigator";

export default mainNavigationScreens = {
    Home: HomeStackNavigator,
    Maps: {
        screen: mapsContainer
    },
    Contacts: ContactsStackNavigator,
    Settings: SettingsStackNavigator,
}
