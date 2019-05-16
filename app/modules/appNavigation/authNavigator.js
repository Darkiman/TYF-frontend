import {createStackNavigator } from 'react-navigation';
import authContainer from "../auth/authContainer";
import loginContainer from "../auth/login/loginContainer";
import signupContainer from "../auth/signup/signupContainer";
import languageContainer from "../settings/language/languageContainer";
import i18nService from "../../utils/i18n/i18nService";
import recoverContainer from "../auth/recover/recoverContainer";

const AuthStack = createStackNavigator({
    Auth:  {
        screen: authContainer,
        navigationOptions: {
            header: null,
            headerBackTitle: i18nService.t('navigation.back'),
        },
    },
    Login: {
        screen: loginContainer,
        navigationOptions: () => ({
            headerBackTitle: i18nService.t('navigation.back'),
        })
    },
    Signup: {
        screen: signupContainer,
        navigationOptions: () => ({
            headerBackTitle: i18nService.t('navigation.back'),
        })
    },
    Recover: {
        screen: recoverContainer,
        navigationOptions: () => ({
            headerBackTitle: i18nService.t('navigation.back'),
        })
    },
    LanguageSettings: {
        screen: languageContainer,
        navigationOptions: () => ({
            title: i18nService.t('navigation.language'),
            headerBackTitle: i18nService.t('navigation.back'),
        })
    },
});
export default AuthStack;
