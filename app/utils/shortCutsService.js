import QuickActions from "react-native-quick-actions";
import {
    DeviceEventEmitter
} from 'react-native';
import i18nService from "./i18n/i18nService";
import userService from "./userService";

const ShortCutsService = {
    initialized: false,
    initialize: function (handleShortCutPress) {
        QuickActions.isSupported(async (error, supported) => {
            if (!supported) {
                console.log("Device does not support 3D Touch or 3D Touch is disabled.");
            } else {
                QuickActions.popInitialAction()
                    .then(this.handleShortCutPress)
                    .catch(console.error);

                DeviceEventEmitter.addListener('quickActionShortcut', handleShortCutPress);
                const user = await userService.getUser();
                if(user) {
                    this.setShortCuts();
                    this.initialized = true;
                }
            }
        });
    },
    setShortCuts: function () {
        QuickActions.isSupported(async (error, supported) => {
            if (!supported) {
                console.log("Device does not support 3D Touch or 3D Touch is disabled.");
            } else {
                const user = await userService.getUser();
                if(user) {
                    const {tracking} = user;
                    QuickActions.setShortcutItems([
                        {
                            type: tracking ? 'stop' : 'start', // Required
                            title: i18nService.t(tracking ? 'stop_sharing' : 'start_sharing'), // Optional, if empty, `type` will be used instead
                            icon: tracking ? 'Pause' : 'Play', // Icons instructions below,
                            userInfo: {
                                url: "app://home", // Provide any custom data like deep linking URL,
                            }
                        }
                    ]);
                }
            }
        });
    },
    clearShortCuts: function () {
        QuickActions.clearShortcutItems();
    }
};
export default ShortCutsService
