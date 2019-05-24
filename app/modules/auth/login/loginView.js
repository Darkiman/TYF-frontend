import React, {Component} from 'react';
import {
    View,
    SafeAreaView
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Icon, Text} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import TextInput from "../../../components/textInput/textInput";
import IconsType from "../../../constants/IconsType";
import {textInputStyle} from "../../../components/textInput/textInputStyle";
import LargeButton from "../../../components/largeButton/largeButton";
import messageService from "../../../utils/messageService";
import FlashMessage from "react-native-flash-message";
import commonService from "../../../services/commonService";
import NavigationRoutes from "../../../constants/NavigationRoutes";
import userService from "../../../utils/userService";

export default class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: {
                email: '',
                password: ''
            }
        }
    }


    handleEmailChange = (text) => {
        let login = this.state.login;
        login.email = text;
        const isEmailValid = commonService.validateEmail(text);
        console.log(isEmailValid);
        this.setState({
            login: login,
            emailValid: isEmailValid
        });
    };

    handlePasswordChange = (text) => {
        let login = this.state.login;
        login.password = text;
        const isPasswordValid = commonService.validatePassword(text);
        this.setState({
            login: login,
            passwordValid: isPasswordValid
        });
    };

    render() {
        const {
            isLoading,
            error,
            data,
            user,
            login
        } = this.props;

        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>
                    <View style={{width: '90%'}}>
                        <TextInput name={'email'}
                                   placeholder={i18nService.t('email')}
                                   disabled={isLoading || user}
                                   icon={'mail'}
                                   value={this.state.login.email}
                                   maxLength={40}
                                   valid={this.state.emailValid}
                                   onChangeText={this.handleEmailChange}
                        />
                        <TextInput name={'password'}
                                   placeholder={i18nService.t('password')}
                                   disabled={isLoading || user}
                                   icon={'lock'}
                                   secureTextEntry={true}
                                   value={this.state.login.password}
                                   maxLength={40}
                                   valid={this.state.passwordValid}
                                   onChangeText={this.handlePasswordChange}
                        />
                    </View>
                    <View style={{width: '90%', alignItems: 'center'}}>
                        <LargeButton title={i18nService.t('login')}
                                     buttonStyle={{marginTop: 20}}
                                     loading={isLoading || user}
                                     disabled={!this.state.emailValid || !this.state.passwordValid}
                                     onPress={async () => {
                                         const password = this.state.login.password;
                                         const result = await login(this.state.login);
                                         if (result.error) {
                                             const errorText = i18nService.t(`validation_message.${result.message}`);
                                             messageService.showError(this.refs.flashMessage, errorText);
                                         } else {
                                             userService.setUser(result.source[0].key, result.source[0].data.email, password, result.source[0].data.token, false);
                                             this.props.navigation.navigate(NavigationRoutes.HOME);
                                         }
                                     }}
                        />
                        <LargeButton type={'clear'}
                                     buttonStyle={{width: 200, backgroundColor: 'white', marginTop: 40}}
                                     buttonText={{fontSize: 14}}
                                     title={i18nService.t('forgot_password')}
                                     onPress={() => {
                                         this.props.navigation.navigate(NavigationRoutes.AUTH_RECOVER)
                                     }}
                        />
                    </View>

                    <FlashMessage position="top" ref={'flashMessage'}/>
                </View>
            </SafeAreaView>
        );
    }
}
