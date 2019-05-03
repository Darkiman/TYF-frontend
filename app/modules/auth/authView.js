import React, {Component} from 'react';
import {
    View,
    SafeAreaView, StyleSheet,
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import NavigationRoutes from "../../constants/NavigationRoutes";
import {Input, Icon, Button, Text} from 'react-native-elements';
import i18nService from "../../utils/i18n/i18nService";
import {largeButtonStyles} from "../../components/largeButton/largeButtonStyle";
import LargeButton from "../../components/largeButton/largeButton";

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
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>
                    <Text h2>{i18nService.t('welcome_to_app')}</Text>
                    <LargeButton title={i18nService.t('login')}
                                 buttonStyle={{
                                     marginTop: 10,
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
                </View>
            </SafeAreaView>
        );
    }
}
