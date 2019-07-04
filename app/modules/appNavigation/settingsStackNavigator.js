import {createStackNavigator} from "react-navigation";
import i18nService from '../../utils/i18n/i18nService';
import settingsContainer from "../settings/settingsContainer";
import languageContainer from "../settings/language/languageContainer";
import aboutContainer from "../settings/about/aboutContainer";
import confidentialityContainer from "../settings/confidentiality/confidentialityContainer";

const SettingsStackNavigator = createStackNavigator({
    Settings: {
        screen: settingsContainer,
        navigationOptions: () => ({
            title: i18nService.t('navigation.settings'),
            headerBackTitle: ' ',
        })
    },
    LanguageSettings: {
        screen: languageContainer,
        navigationOptions: () => ({
            title: i18nService.t('navigation.language'),
            headerBackTitle: ' ',
        })
    },
    AboutSettings: {
        screen: aboutContainer,
        navigationOptions: () => ({
            header: null,
        })
    },
    ConfidentialitySettings: {
        screen: confidentialityContainer,
        navigationOptions: () => ({
            title: i18nService.t('navigation.confidentiality'),
            headerBackTitle: ' ',
        })
    }
});

export default SettingsStackNavigator;


