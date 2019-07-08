import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    Alert,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import i18nService from "../../../utils/i18n/i18nService";
import TextInput from "../../../components/textInput/textInput";
import LargeButton from "../../../components/largeButton/largeButton";
import messageService from "../../../utils/messageService";
import FlashMessage from "react-native-flash-message";
import commonService from "../../../services/commonService";
import NavigationRoutes from "../../../constants/NavigationRoutes";
import userService from "../../../utils/userService";
import LinearGradient from "react-native-linear-gradient";
import NavigationBack from "../../../components/navigationBack/navigationBack";
import CommonConstant from "../../../constants/CommonConstant";
import asyncStorageService from "../../../utils/asyncStorageService";
import ax from "../../../utils/axios";
import apiConfig from "../../../utils/apiConfig";

export default class LoginView extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            login: {
                email: navigation.getParam('email'),
                password: navigation.getParam('password')
            }
        }
    }

    componentDidMount() {
        this.initialize();
    }

    async initialize() {
        this.notificationToken = await asyncStorageService.getItem('fcmToken');
        let {email, password} = this.state.login;
        if(email) {
            messageService.showInfo(this.refs.flashMessage, i18nService.t(`please_verify_your_email`));
        } else {
            this.user = await userService.getUser();
            if(this.user) {
                email = this.user.email;
                password = this.user.password;
            }
        }
        if(email && password) {
            this.handleEmailChange(email);
            this.handlePasswordChange(password);
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

    resentEmailVerification = async (user) => {
        try {
            const result = await ax.post(`${apiConfig.url}auth/resent-verify-email`, {
                id: user.id
            });
            if(result.error) {
                messageService.showError(this.refs.flashMessage, i18nService.t(`validation_message.server_is_not_available`));
            } else {
                messageService.showInfo(this.refs.flashMessage, i18nService.t(`new_email_verification_sent_to_your_email`));
            }
        } catch (e) {
            messageService.showError(this.refs.flashMessage, i18nService.t(`validation_message.server_is_not_available`));
            console.log(e);
        }
    };

    back = () => {
        this.props.navigation.goBack();
    };

    render() {
        const {
            isLoading,
            error,
            data,
            user,
            login
        } = this.props;
        const {email, password} = this.state.login;
        const {passwordValid, emailValid} = this.state;
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                    <KeyboardAvoidingView style={sharedStyles.safeView} behavior="padding" enabled>
                        <NavigationBack onPress={() => {
                            this.back();
                        }}/>
                        <View style={sharedStyles.centredColumn}>
                            <View style={{width: '90%'}}>
                                <TextInput name={'email'}
                                           placeholder={i18nService.t('email')}
                                           disabled={isLoading || user}
                                           icon={'mail'}
                                           value={email}
                                           keyboardType={'email-address'}
                                           maxLength={CommonConstant.MAX_EMAIL_LENGTH}
                                           valid={emailValid}
                                           onChangeText={this.handleEmailChange}
                                />
                                <TextInput name={'password'}
                                           placeholder={i18nService.t('password')}
                                           disabled={isLoading || user}
                                           icon={'lock'}
                                           secureTextEntry={true}
                                           value={password}
                                           maxLength={CommonConstant.MAX_PASSWORD_LENGTH}
                                           valid={passwordValid}
                                           onChangeText={this.handlePasswordChange}
                                />
                            </View>
                            <View style={{width: '90%', alignItems: 'center'}}>
                                <LargeButton title={i18nService.t('login')}
                                             buttonStyle={{marginTop: 20}}
                                             loading={isLoading || user}
                                             disabled={!emailValid || !passwordValid}
                                             onPress={async () => {
                                                 const currentPassword = this.state.login.password;
                                                 const currentLocale = i18nService.getCurrentLocale();
                                                 ax.defaults.headers.common['Authorization'] = ``;
                                                 const result = await login({
                                                     ...this.state.login,
                                                     notificationToken: this.notificationToken,
                                                     language: currentLocale
                                                 });
                                                 if (result.error) {
                                                     const errorText = i18nService.t(`validation_message.${result.message}`);
                                                     messageService.showError(this.refs.flashMessage, errorText);
                                                 } else {
                                                     const user = {
                                                         id: result.source[0].key,
                                                         email: result.source[0].data.email,
                                                         name: result.source[0].data.name[0],
                                                         password: currentPassword,
                                                         token: result.source[0].data.token,
                                                         tracking: false,
                                                         avatar: result.source[0].data.avatar,
                                                         language: currentLocale,
                                                         verified: result.source[0].data.verified,
                                                         confidentiality: {
                                                             showPositionOnMap: true,
                                                             showPositionOnlyToContacts: true,
                                                             accepted: false
                                                         }
                                                     };
                                                     if(!user.verified) {
                                                         Alert.alert(
                                                             i18nService.t('email_not_verified'),
                                                             i18nService.t('verify_your_email'),
                                                             [
                                                                 {
                                                                     text: i18nService.t('resent_verification_email'),
                                                                     onPress: () => {
                                                                         this.resentEmailVerification(user);
                                                                     }},
                                                                 {
                                                                     text: i18nService.t('cancel'),
                                                                     onPress: () => {

                                                                     }
                                                                 }
                                                             ],
                                                             {cancelable: true},
                                                         );
                                                     } else {
                                                         userService.setUser(user);
                                                         this.props.navigation.navigate(NavigationRoutes.HOME);
                                                     }
                                                 }
                                             }}
                                />
                                <LargeButton type={'clear'}
                                             buttonStyle={{width: 200, marginTop: 40}}
                                             title={i18nService.t('forgot_password')}
                                             onPress={() => {
                                                 this.props.navigation.navigate(NavigationRoutes.AUTH_RECOVER)
                                             }}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
