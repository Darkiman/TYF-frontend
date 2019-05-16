import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import NavigationRoutes from "../../constants/NavigationRoutes";
import {Text} from 'react-native-elements';
import i18nService from "../../utils/i18n/i18nService";
import LargeButton from "../../components/largeButton/largeButton";
import userService from "../../utils/userService";
import ax from "../../utils/axios";
import apiConfig from "../../utils/apiConfig";
import SplashScreen from "react-native-splash-screen";

export default class AuthView extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.initialize();
    }

    async initialize() {
        if (!i18nService.initialized) {
            await i18nService.initialize();
            this.forceUpdate();
        }
        const user = await userService.getUser();
        if (user && user.token) {
            ax.defaults.headers.common['Authorization'] = `Token ${user.token}`;
        }
        if (user) {
            try {
                const response = await ax.post(`${apiConfig.url}auth/login`, {
                    email: user.email,
                    password: user.password
                });
                if (response && response.data[0].key) {
                    this.props.navigation.navigate(NavigationRoutes.HOME);
                } else {
                    SplashScreen.hide()
                }
            } catch (error) {
                SplashScreen.hide();
            }
        }
    }

    render() {
        const {
            isLoading,
            error,
            data,
        } = this.props;
        if (!i18nService.initialized) {
            return null;
        }
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={{...sharedStyles.centredColumn, width: '90%', marginLeft: '5%'}}>
                    <Text h4>{i18nService.t('welcome_to_app')}</Text>
                    <LargeButton title={i18nService.t('login')}
                                 buttonStyle={{
                                     marginTop: 30,
                                     marginBottom: 20
                                 }}
                                 onPress={() => {
                                     this.props.navigation.navigate(NavigationRoutes.AUTH_LOGIN)
                                 }}
                    />
                    <LargeButton type="outline"
                                 title={i18nService.t('sign_up')}
                                 onPress={() => {
                                     this.props.navigation.navigate(NavigationRoutes.AUTH_SIGNUP)
                                 }}
                    />

                    <LargeButton type={'clear'}
                                 buttonStyle={{width: 200, backgroundColor: 'white', marginTop: 40}}
                                 buttonText={{fontSize: 14}}
                                 title={i18nService.t('change_language')}
                                 onPress={() => {
                                     this.props.navigation.navigate(NavigationRoutes.LANGUAGE_SETTINGS, {
                                         from: NavigationRoutes.AUTH,
                                         update: () => {
                                             this.forceUpdate();
                                         }
                                     })
                                 }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
