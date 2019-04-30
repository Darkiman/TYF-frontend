import React, {Component} from 'react';
import {
    View,
    SafeAreaView, AsyncStorage,
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Input, Icon, Button, Text} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import {largeButtonStyles} from "../../../shared/styles/button/buttonStyle";
import IconsType from "../../../constants/IconsType";
import iconsService from "../../../utils/IconsService";
import {textInputStyle} from "../../../shared/styles/input/textInputStyle";

export default class SignupView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
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
                        <Input name={'email'}
                               placeholder={i18nService.t('email')}
                               disabled={isLoading || user}
                               value={this.state.signup.email}
                               onChange={this.handleEmailChange}
                               containerStyle={textInputStyle.containerStyle}
                               inputContainerStyle={textInputStyle.inputContainerStyle}
                               leftIcon={
                                   {
                                       type: IconsType.Ionicon,
                                       name: `${this.iconPrefix}-mail`,
                                       color: textInputStyle.leftIconColor
                                   }
                               }
                               leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                        />
                        <Input name={'name'}
                               placeholder={i18nService.t('name')}
                               disabled={isLoading || user}
                               value={this.state.signup.name}
                               onChange={this.handleNameChange}
                               containerStyle={textInputStyle.containerStyle}
                               inputContainerStyle={textInputStyle.inputContainerStyle}
                               leftIcon={
                                   {
                                       type: IconsType.Ionicon,
                                       name: `${this.iconPrefix}-contact`,
                                       color: textInputStyle.leftIconColor
                                   }
                               }
                               leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                        />
                        <Input name={'password'}
                               placeholder={i18nService.t('password')}
                               disabled={isLoading || user}
                               value={this.state.signup.password}
                               onChange={this.handlePasswordChange}
                               containerStyle={textInputStyle.containerStyle}
                               inputContainerStyle={textInputStyle.inputContainerStyle}
                               leftIcon={
                                   {
                                       type: IconsType.Ionicon,
                                       name: `${this.iconPrefix}-lock`,
                                       color: textInputStyle.leftIconColor
                                   }
                               }
                               leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                        />
                        <Input name={'confirmPassword'}
                               placeholder={i18nService.t('confirm_password')}
                               disabled={isLoading || user}
                               value={this.state.signup.confirmPassword}
                               onChange={this.handleConfirmPasswordChange}
                               containerStyle={textInputStyle.containerStyle}
                               inputContainerStyle={textInputStyle.inputContainerStyle}
                               leftIcon={
                                   {
                                       type: IconsType.Ionicon,
                                       name: `${this.iconPrefix}-lock`,
                                       color: textInputStyle.leftIconColor
                                   }
                               }
                               leftIconContainerStyle={textInputStyle.leftIconContainerStyle}
                        />
                    </View>
                    <Button title={i18nService.t('sign_up')}
                            containerViewStyle={largeButtonStyles.buttonStyle}
                            buttonStyle={{...largeButtonStyles.buttonStyle, marginTop: 20}}
                            titleStyle={largeButtonStyles.buttonText}
                            loadingStyle={largeButtonStyles.loadingStyle}
                            loadingProps={largeButtonStyles.indicatorSize}
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
