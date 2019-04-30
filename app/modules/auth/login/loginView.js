import React, { Component } from 'react';
import {
    View,
    ActivityIndicator, SafeAreaView,
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import { Input, Icon, Button, Text } from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";

export default class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: {
                email: '',
                name: '',
                password: ''
            },
            signup: {
                email: '',
                name: '',
                password: '',
                confirm: 'password'
            }
        }
    }

    componentWillUnmount() {
        // navigator.geolocation.clearWatch(this.watchId);
    }

    handleLoginChange = (event = {}) => {
        const name = event.target && event.target.name;
        const value = event.target && event.target.value;
        let login = this.state.login;
        login[name] = value;
        this.setState({
            login: login
        });
    };

    handleSignUpChange = (event = {}) => {
        const name = event.target && event.target.name;
        const value = event.target && event.target.value;
        let login = this.state.login;
        login[name] = value;
        this.setState({
            login: login
        });
    };

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
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>
                    <Text h2>{i18nService.t('login')}</Text>
                    <Input name={'email'}
                           placeholder={i18nService.t('email')}
                           value={this.state.login.email}
                           onChangeText={this.handleLoginChange}
                    />
                    <Input name={'email'}
                           placeholder={i18nService.t('password')}
                           value={this.state.login.password}
                           onChangeText={this.handleLoginChange}
                    />
                    <Button title={i18nService.t('login')}
                            onPress={() => {
                                login();
                            }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
