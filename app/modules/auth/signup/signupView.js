import React, {Component} from 'react';
import {
    View,
    SafeAreaView, AsyncStorage,
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Button, Text} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import {largeButtonStyles} from "../../../components/largeButton/largeButtonStyle";
import TextInput from "../../../components/textInput/textInput";
import LargeButton from "../../../components/largeButton/largeButton";

export default class SignupView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: {
                email: '',
                name: '',
                password: '',
                confirmPassword: ''
            }
        }
    }

    componentDidMount() {
        this.initialize()
    }

    async initialize() {
        this.notificationToken = await AsyncStorage.getItem('fcmToken');
    }

    handleEmailChange = (text) => {
        let signup = this.state.signup;
        signup.email = text;
        this.setState({
            signup: signup
        });
    };

    handleNameChange = (text) => {
        let signup = this.state.signup;
        signup.name = text;
        this.setState({
            signup: signup
        });
    };

    handlePasswordChange = (text) => {
        let signup = this.state.signup;
        signup.password = text;
        this.setState({
            signup: signup
        });
    };

    handleConfirmPasswordChange = (text) => {
        let signup = this.state.signup;
        signup.confirmPassword = text;
        this.setState({
            signup: signup
        });
    };

    render() {
        const {
            isLoading,
            error,
            data,
            user,
            signup
        } = this.props;

        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>
                    <Text h2>{i18nService.t('sign_up')}</Text>
                    <View style={{width: '90%'}}>
                        <TextInput name={'email'}
                                   placeholder={i18nService.t('email')}
                                   disabled={isLoading || user}
                                   icon={'mail'}
                                   value={this.state.signup.email}
                                   onChange={this.handleEmailChange}
                        />
                        <TextInput name={'name'}
                                   placeholder={i18nService.t('name')}
                                   disabled={isLoading || user}
                                   icon={'contact'}
                                   value={this.state.signup.name}
                                   onChange={this.handleNameChange}
                        />
                        <TextInput name={'password'}
                                   placeholder={i18nService.t('password')}
                                   disabled={isLoading || user}
                                   icon={'lock'}
                                   secureTextEntry={true}
                                   value={this.state.signup.password}
                                   onChange={this.handlePasswordChange}
                        />
                        <TextInput name={'confirmPassword'}
                                   placeholder={i18nService.t('confirm_password')}
                                   disabled={isLoading || user}
                                   icon={'lock'}
                                   secureTextEntry={true}
                                   value={this.state.signup.confirmPassword}
                                   onChange={this.handleConfirmPasswordChange}
                        />
                    </View>
                    <LargeButton title={i18nService.t('sign_up')}
                                 buttonStyle={{marginTop: 20}}
                                 loading={isLoading || user}
                                 onPress={() => {
                                     signup({
                                         ...this.state.signup,
                                         notificationToken: this.notificationToken
                                     });
                                 }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
