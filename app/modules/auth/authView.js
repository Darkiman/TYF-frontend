import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    Image
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import NavigationRoutes from "../../constants/NavigationRoutes";
import {Text} from 'react-native-elements';
import i18nService from "../../utils/i18n/i18nService";
import LargeButton from "../../components/largeButton/largeButton";
import LinearGradient from 'react-native-linear-gradient';

const styles = {
    mainContainer: {
        width: '90%',
        marginLeft: '5%'
    },
    logo: {
        width: 100,
        height: 125,
        marginBottom: 100
    }
};

const logo = require('../../assets/images/logoIcon.png');

export default class AuthView extends Component {
    constructor(props) {
        super(props);
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
            <LinearGradient style={{...sharedStyles.safeView }}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={{...sharedStyles.safeView}}>
                    <View style={{...sharedStyles.centredColumn, ...styles.mainContainer}}>
                        <Image style={styles.logo} source={logo}/>
                        <Text h4 style={sharedStyles.h4}>{i18nService.t('welcome_to_app')}</Text>
                        <LargeButton title={i18nService.t('login')}
                                     buttonStyle={{
                                         marginTop: 50,
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
                                     buttonStyle={{width: 200, marginTop: 39}}
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
            </LinearGradient>
        );
    }
}
