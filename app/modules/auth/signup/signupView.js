import React, {Component} from 'react';
import {
    View,
    SafeAreaView, AsyncStorage,
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Button, Text, Icon} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import TextInput from "../../../components/textInput/textInput";
import LargeButton from "../../../components/largeButton/largeButton";
import IconsType from "../../../constants/IconsType";
import {textInputStyle} from "../../../components/textInput/textInputStyle";
import iconsService from "../../../utils/iconsService";
import ModalOverlay from "../../../components/overlay/overlay";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import messageService from "../../../utils/messageService";

export default class SignupView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = this.iconPrefix = iconsService.getIconPrefix();
        this.state = {
            signup: {
                email: '',
                name: '',
                password: '',
                confirmPassword: ''
            },
            emailValid: false,
            nameErrorMessage: false,
            passwordErrorMessage: false,
            confirmPasswordErrorMessage: false,

            showPasswordTooltip: false,
            showNameTooltip: false,
            showAlerts: false
        };
        this.passwordRef = null;
        this.nameRef = null;
        this.viewRef = null;
    }

    componentDidMount() {
        this.initialize()
    }

    componentWillUnmount() {
        this.setState({
            showPasswordTooltip: false,
            showNameTooltip: false
        })
    }

    async initialize() {
        this.notificationToken = await AsyncStorage.getItem('fcmToken');
    }

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    handleEmailChange = (text) => {
        let signup = this.state.signup;
        signup.email = text;
        const isEmailValid = this.validateEmail(text);
        console.log(isEmailValid);
        this.setState({
            signup: signup,
            emailValid: isEmailValid
        });
    };

    handleNameChange = (text) => {
        let signup = this.state.signup;
        signup.name = text;
        const isNameValid = text && text.length < 6 ? false : true;
        this.setState({
            signup: signup,
            nameValid: isNameValid
        });
    };

    handlePasswordChange = (text) => {
        let signup = this.state.signup;
        signup.password = text;
        const isPasswordValid = text && text.length < 6 ? false : true;
        this.setState({
            signup: signup,
            passwordValid: isPasswordValid
        });
    };

    handleConfirmPasswordChange = (text) => {
        let signup = this.state.signup;
        signup.confirmPassword = text;
        const isConfirmPasswordValid = signup.password === text ? true : false ;
        this.setState({
            signup: signup,
            confirmPasswordValid: isConfirmPasswordValid
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

        if(error && this.showAlerts) {
            this.showAlerts = false;
            const errorText = i18nService.t(`validation_message.${data.data}`);
            messageService.showError(errorText);
        }

        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>
                    <Text h2>{i18nService.t('sign_up')}</Text>
                    <View style={{width: '90%'}} ref={(ref) => this.viewRef = ref}>
                        <TextInput name={'email'}
                                   placeholder={i18nService.t('email')}
                                   disabled={isLoading || user}
                                   icon={'mail'}
                                   value={this.state.signup.email}
                                   valid={this.state.emailValid}
                                   onChangeText={this.handleEmailChange}
                        />
                        <TextInput ref={(ref) => this.nameRef = ref}
                                   name={'name'}
                                   placeholder={i18nService.t('name')}
                                   disabled={isLoading || user}
                                   icon={'contact'}
                                   value={this.state.signup.name}
                                   valid={this.state.nameValid}
                                   onChangeText={this.handleNameChange}
                                   rightIcon={
                                       <Icon
                                           type={IconsType.Ionicon}
                                           name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                           size={24}
                                           color={this.state.nameValid ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor}
                                           onPress={() => {
                                               this.setState({
                                                   showNameTooltip: !this.state.showNameTooltip
                                               })
                                           }}
                                       />
                                   }
                        />
                        <TextInput ref={(ref) => this.passwordRef = ref}
                                   name={'password'}
                                   placeholder={i18nService.t('password')}
                                   disabled={isLoading || user}
                                   icon={'lock'}
                                   secureTextEntry={true}
                                   value={this.state.signup.password}
                                   valid={this.state.passwordValid}
                                   onChangeText={this.handlePasswordChange}
                                   rightIcon={
                                       <Icon
                                           type={IconsType.Ionicon}
                                           name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                           size={24}
                                           color={this.state.passwordValid ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor}
                                           onPress={() => {
                                               this.setState({
                                                   showPasswordTooltip: !this.state.showPasswordTooltip
                                               })
                                           }}
                                       />
                                   }
                        />
                        <TextInput name={'confirmPassword'}
                                   placeholder={i18nService.t('confirm_password')}
                                   disabled={isLoading || user}
                                   icon={'lock'}
                                   secureTextEntry={true}
                                   value={this.state.signup.confirmPassword}
                                   valid={this.state.confirmPasswordValid}
                                   onChangeText={this.handleConfirmPasswordChange}
                        />
                    </View>
                    <LargeButton title={i18nService.t('sign_up')}
                                 buttonStyle={{marginTop: 20}}
                                 loading={isLoading || user}
                                 disabled={!this.state.emailValid || !this.state.nameValid || !this.state.passwordValid || !this.state.confirmPasswordValid}
                                 onPress={() => {
                                     this.showAlerts = true;
                                     signup({
                                         ...this.state.signup,
                                         notificationToken: this.notificationToken
                                     });
                                 }}
                    />

                    <ModalOverlay
                        isVisible={this.state.showNameTooltip}
                        onBackdropPress={()=> {
                            this.setState({
                                showNameTooltip: !this.state.showNameTooltip
                            })
                        }}
                        windowBackgroundColor="rgba(0, 0, 0, 0.35)"
                        overlayBackgroundColor="#ffffff"
                        width="auto"
                        height="auto">
                        <Text>{i18nService.t('validation_message.name_should_be_more_symbols', {symbols: 6})}</Text>
                    </ModalOverlay>
                    <ModalOverlay
                        isVisible={this.state.showPasswordTooltip}
                        onBackdropPress={()=> {
                            this.setState({
                                showPasswordTooltip: !this.state.showPasswordTooltip
                            })
                        }}
                        windowBackgroundColor="rgba(0, 0, 0, 0.35)"
                        overlayBackgroundColor="#ffffff"
                        width="90%"
                        height="auto">
                        <Text style={{fontSize: 16}}>{i18nService.t('validation_message.password_requirements', {symbols: 8})}</Text>
                    </ModalOverlay>

                    <FlashMessage position="top" />
                </View>
            </SafeAreaView>
        );
    }
}
