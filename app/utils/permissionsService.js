import {Alert, Platform, PermissionsAndroid} from "react-native";
import Permissions from 'react-native-permissions';
import i18nService from "./i18n/i18nService";
import OpenSettings from "react-native-open-settings";

const PermissionsService = {
    isEnableGeoLocationAlertVisible: false,
    isEnableNotificationsAlertVisible: false,
    isLocationPermissionEnabled: async () => {
        let locationPermission;
        if (Platform.OS === 'ios') {
            locationPermission = await Permissions.check('location', {type: 'always'});
            if (locationPermission === 'denied') {
                return false;
            }
        } else {
            locationPermission = await Permissions.check('location');
            if (locationPermission !== 'authorized') {
                return false;
            }
        }
        return true;
    },
    isWhenInUseLocationPermissionEnabled: async () => {
        let locationPermission;
        if (Platform.OS === 'ios') {
            locationPermission = await Permissions.check('location', {type: 'whenInUse'});
            if (locationPermission === 'denied') {
                return false;
            }
        } else {
            locationPermission = await Permissions.check('location');
            if (locationPermission !== 'authorized') {
                return false;
            }
        }
        return true;
    },
    requestGelocationPermission: async () => {
        await Permissions.request('location', { type: 'always' });
    },
    enableGeoLocation: async (text) => {
        if(this.isEnableGeoLocationAlertVisible) {
            return;
        }
        if(Platform.OS === 'ios') {
            let response = await Permissions.request('location', { type: 'always' });
            if(response === 'denied') {
                this.isEnableGeoLocationAlertVisible = true;
                Alert.alert(
                    i18nService.t('access_denied'),
                    i18nService.t(text ? text : 'set_geolocation_to_always'),
                    [
                        {
                            text: i18nService.t('go_app_to_settings'),
                            onPress: () => {
                                this.isEnableGeoLocationAlertVisible = false;
                                OpenSettings.openSettings();
                            }},
                        {
                            text: i18nService.t('cancel'),
                            onPress: () => {
                                this.isEnableGeoLocationAlertVisible = false;
                            }
                        }
                    ],
                    {cancelable: true},
                );
            }
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': i18nService.t('access_denied'),
                        'message': i18nService.t('enable_geolocation')
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
               return false;
            }
        }
    },
    checkNotificationPermissions:  async () => {
      return await Permissions.check('notification', { type: ['alert'] });
    },
    enableNotifications: async () => {
       return await Permissions.request('notification', { type: ['alert'] });
    },
    enableNotificationsFromSettings: async () => {
        if(!this.isEnableNotificationsAlertVisible) {
            this.isEnableNotificationsAlertVisible = true;
            Alert.alert(
                i18nService.t('access_denied'),
                i18nService.t( 'notifications_disabled_to_this_app'),
                [
                    {
                        text: i18nService.t('go_app_to_settings'),
                        onPress: () => {
                            this.isEnableNotificationsAlertVisible = false;
                            OpenSettings.openSettings();
                        }},
                    {
                        text: i18nService.t('cancel'),
                        onPress: () => {
                            this.isEnableNotificationsAlertVisible = false;
                        }
                    }
                ],
                {cancelable: true},
            );
        }
    }
};
export default PermissionsService
