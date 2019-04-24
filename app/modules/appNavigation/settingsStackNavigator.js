import {createStackNavigator} from "react-navigation";
import i18nService from '../../utils/i18n/i18nService';
import settingsContainer from "../settings/settingsContainer";
import languageContainer from "../settings/language/languageContainer";

const SettingsStackNavigator = createStackNavigator({
    Settings: {
        screen: settingsContainer,
        navigationOptions: () => ({
            title: i18nService.t('navigation.settings'),
            headerBackTitle: i18nService.t('navigation.back'),
        })
    },
    LanguageSettings: {
        screen: languageContainer,
    }
});

export default SettingsStackNavigator;

