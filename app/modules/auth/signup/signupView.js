import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
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
import FlashMessage from "react-native-flash-message";
import messageService from "../../../utils/messageService";
import commonService from "../../../services/commonService";
import asyncStorageService from "../../../utils/asyncStorageService";
import userService from "../../../utils/userService";
import NavigationRoutes from "../../../constants/NavigationRoutes";
import LinearGradient from "react-native-linear-gradient";
import NavigationBack from "../../../components/navigationBack/navigationBack";
import CommonConstant from "../../../constants/CommonConstant";

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
        this.notificationToken = await asyncStorageService.getItem('fcmToken');
    }

    handleEmailChange = (text) => {
        let signup = this.state.signup;
        signup.email = text;
        const isEmailValid = commonService.validateEmail(text);
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
        const isPasswordValid = commonService.validatePassword(text);
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

    back = () => {
        this.props.navigation.goBack();
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
            <LinearGradient style={{...sharedStyles.safeView}}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                    <NavigationBack onPress={() => {
                        this.back();
                    }}/>
                    <View style={sharedStyles.centredColumn}>
                        <View style={{width: '90%'}}>
                            <TextInput name={'email'}
                                       placeholder={i18nService.t('email')}
                                       disabled={isLoading || user}
                                       icon={'mail'}
                                       value={this.state.signup.email}
                                       maxLength={CommonConstant.MAX_EMAIL_LENGTH}
                                       valid={this.state.emailValid}
                                       onChangeText={this.handleEmailChange}
                            />
                            <TextInput ref={(ref) => this.nameRef = ref}
                                       name={'name'}
                                       placeholder={i18nService.t('name')}
                                       disabled={isLoading || user}
                                       icon={'contact'}
                                       value={this.state.signup.name}
                                       maxLength={CommonConstant.MAX_NAME_LENGTH}
                                       valid={this.state.nameValid}
                                       onChangeText={this.handleNameChange}
                                       rightIcon={
                                           <Icon
                                               type={IconsType.Ionicon}
                                               name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                               size={24}
                                               color={this.state.nameValid ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor}
                                               underlayColor={'transparent'}
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
                                       maxLength={CommonConstant.MAX_PASSWORD_LENGTH}
                                       valid={this.state.passwordValid}
                                       onChangeText={this.handlePasswordChange}
                                       rightIcon={
                                           <Icon
                                               type={IconsType.Ionicon}
                                               name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                               size={24}
                                               color={this.state.passwordValid ? textInputStyle.leftIconColorFocused : textInputStyle.leftIconColor}
                                               underlayColor={'transparent'}
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
                                       maxLength={CommonConstant.MAX_PASSWORD_LENGTH}
                                       valid={this.state.confirmPasswordValid}
                                       onChangeText={this.handleConfirmPasswordChange}
                            />
                        </View>
                        <View style={{width: '90%'}}>
                            <LargeButton title={i18nService.t('sign_up')}
                                         buttonStyle={{marginTop: 20}}
                                         loading={isLoading || user}
                                         disabled={!this.state.emailValid || !this.state.nameValid || !this.state.passwordValid || !this.state.confirmPasswordValid}
                                         onPress={async () => {
                                             const password = this.state.signup.password;
                                             const result = await signup({
                                                 ...this.state.signup,
                                                 notificationToken: this.notificationToken
                                             });
                                             if(result.error) {
                                                 const errorText = i18nService.t(`validation_message.${result.message}`);
                                                 messageService.showError(this.refs.flashMessage, errorText);
                                             } else {
                                                 const user = {
                                                     id: result.source.key,
                                                     email: result.source[0].data.email,
                                                     name: result.source[0].data.name[0],
                                                     password: password,
                                                     token: result.source[0].data.token,
                                                     tracking: false,
                                                     avatar: result.source[0].data.avatar
                                                 };
                                                 userService.setUser(user);
                                                 this.props.navigation.navigate(NavigationRoutes.HOME);
                                             }
                                         }}
                            />
                        </View>

                        <ModalOverlay
                            isVisible={this.state.showNameTooltip}
                            onBackdropPress={()=> {
                                this.setState({
                                    showNameTooltip: !this.state.showNameTooltip
                                })
                            }}>
                            <Text>{i18nService.t('validation_message.name_should_be_more_symbols', {symbols: CommonConstant.MIN_NAME_LENGTH})}</Text>
                        </ModalOverlay>
                        <ModalOverlay
                            isVisible={this.state.showPasswordTooltip}
                            onBackdropPress={()=> {
                                this.setState({
                                    showPasswordTooltip: !this.state.showPasswordTooltip
                                })
                            }}>
                            <Text style={{fontSize: 16}}>{i18nService.t('validation_message.password_requirements', {symbols: CommonConstant.MIN_PASSWORD_LENGTH})}</Text>
                        </ModalOverlay>
                    </View>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
