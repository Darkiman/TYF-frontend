import React, { Component } from 'react';
import {
    View,
    SafeAreaView, StyleSheet,
} from 'react-native';
import {sharedStyles} from "../../shared/styles/sharedStyles";
import NavigationRoutes from "../../constants/NavigationRoutes";
import { Input, Icon, Button, Text } from 'react-native-elements';
import i18nService from "../../utils/i18n/i18nService";
import {largeButtonStyles} from "../../shared/styles/button/buttonStyle";

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
                    <Button title={i18nService.t('login')}
                            containerViewStyle={largeButtonStyles.buttonStyle}
                            buttonStyle={{
                                ...largeButtonStyles.buttonStyle,
                                marginTop: 10,
                                marginBottom: 20
                            }}
                            titleStyle={largeButtonStyles.buttonText}
                            onPress={() => {
                                this.props.navigation.navigate(NavigationRoutes.AUTH_LOGIN)
                            }}/>
                    <Button type="outline"
                            title={i18nService.t('sign_up')}
                            containerViewStyle={largeButtonStyles.buttonStyle}
                            buttonStyle={largeButtonStyles.buttonStyle}
                            titleStyle={largeButtonStyles.buttonText}
                            onPress={() => {
                                this.props.navigation.navigate(NavigationRoutes.AUTH_SIGNUP)
                            }}/>
                </View>
            </SafeAreaView>
        );
    }
}
