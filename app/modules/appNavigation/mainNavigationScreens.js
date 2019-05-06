import React from 'react';
import homeContainer from "../home/homeContainer";
import SettingsStackNavigator from "./settingsStackNavigator";
import mapsContainer from "../maps/mapsContainer";
import contactsContainer from "../contacts/contactsContainer";

export default mainNavigationScreens = {
    Home: {
        screen: homeContainer
    },
    Maps: {
        screen: mapsContainer
    },
    Contacts: contactsContainer,
    Settings: SettingsStackNavigator,
}
