import {Alert, Platform, PermissionsAndroid} from "react-native";
import Permissions from 'react-native-permissions';
import i18nService from "./i18n/i18nService";
import OpenSettings from "react-native-open-settings";

const PermissionsService = {
    isLocationPermissionEnabled: async () => {
        let locationPermission;
        if (Platform.OS === 'ios') {
            locationPermission = await Permissions.check('location', {type: 'always'});
            console.log(locationPermission);
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
    isEnableGeoLocationAlertVisible: false,
    enableGeoLocation: async () => {
        if(this.isEnableGeoLocationAlertVisible) {
            return;
        }
        if(Platform.OS === 'ios') {
            this.isEnableGeoLocationAlertVisible = true;
            Alert.alert(
                i18nService.t('access_denied'),
                i18nService.t(Platform.OS === 'ios' ? 'set_geolocation_to_always' : 'enable_geolocation'),
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
    }
};
export default PermissionsService
