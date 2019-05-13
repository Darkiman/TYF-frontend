import React from 'react';
import homeContainer from "../home/homeContainer";
import SettingsStackNavigator from "./settingsStackNavigator";
import mapsContainer from "../maps/mapsContainer";
import ContactsStackNavigator from "./contactsStackNavigator";

export default mainNavigationScreens = {
    Home: {
        screen: homeContainer
    },
    Maps: {
        screen: mapsContainer
    },
    Contacts: ContactsStackNavigator,
    Settings: SettingsStackNavigator,
}
