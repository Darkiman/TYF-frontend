import React, { Component } from 'react';
import {
    View,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/sharedStyles";
import NavigationRoutes from "../../constants/NavigationRoutes";
import { Input, Icon, Button, Text } from 'react-native-elements';
import i18nService from "../../utils/i18n/i18nService";

export default class AuthView extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        // navigator.geolocation.clearWatch(this.watchId);
    }

    render() {
        const {
            isLoading,
            error,
            data,
            login,
            signup
        } = this.props;
        console.log(this.props);
        return (
            <SafeAreaView forceInset={{top:'always'}} style={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage/> : null}

                    <View>
                        <Text h2>{i18nService.t('login')}</Text>
                        <Input
                            placeholder={i18nService.t('email')}
                        />
                        <Input
                            placeholder={i18nService.t('password')}
                        />
                        <Button title={i18nService.t('login')}
                                onPress={() => {
                                   login();
                                }}
                        />
                    </View>
                    <View>
                        <Text h2>{i18nService.t('sign_up')}</Text>
                        <Input
                            placeholder={i18nService.t('email')}
                        />
                        <Input
                            placeholder={i18nService.t('password')}
                        />
                        <Input
                            placeholder={i18nService.t('confirm_password')}
                        />
                        <Button title={i18nService.t('sign_up')}
                                onPress={() => {
                                    signup();
                                }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
