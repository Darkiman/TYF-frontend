import React, {Component} from 'react';
import {
    View,
    SafeAreaView
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
import ax from "../../../utils/axios";
import networkService from "../../../utils/networkService";
import apiConfig from "../../../utils/apiConfig";
import LinearGradient from "react-native-linear-gradient";
import NavigationBack from "../../../components/navigationBack/navigationBack";
import CommonConstant from "../../../constants/CommonConstant";

export default class RecoverView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recover: {
                email: '',
            },
            isLoading: false,
            done: false
        }
    }

    handleEmailChange = (text) => {
        let recover = this.state.recover;
        recover.email = text;
        const isEmailValid = commonService.validateEmail(text);
        this.setState({
            recover: recover,
            emailValid: isEmailValid
        });
    };

    recoverPassword = async (recover) => {
        if (!networkService.isConnected) {
            return {
                error: true,
                message: 'internet_connection_not_available'
            };
        }
        try {
            const data = await ax.post(`${apiConfig.url}auth/recover`, recover);
            const result = {
                source: data,
                error: false
            };
            return result;
        } catch (error) {
            const text = networkService.getErrorText(error);
            const result = {
                source: error,
                error: true,
                message: text
            };
            return result;
        }
    };

    back = () => {
        this.props.navigation.goBack();
    };

    render() {
        const {isLoading, emailValid, done} = this.state;
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
                                       disabled={isLoading}
                                       icon={'mail'}
                                       value={this.state.recover.email}
                                       maxLength={CommonConstant.MAX_EMAIL_LENGTH}
                                       valid={emailValid}
                                       onChangeText={this.handleEmailChange}
                            />
                        </View>
                        <View style={{width: '90%'}}>
                            <LargeButton
                                title={done ? i18nService.t('go_to_login') : i18nService.t('recover_password')}
                                buttonStyle={{marginTop: 20}}
                                loading={isLoading}
                                disabled={!emailValid}
                                onPress={async () => {
                                    if (!done && !isLoading) {
                                        this.setState({
                                            isLoading: true
                                        });
                                        const result = await this.recoverPassword(this.state.recover);
                                        if (result.error) {
                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                            this.setState({
                                                isLoading: false
                                            });
                                            messageService.showError(this.refs.flashMessage, errorText);
                                        } else {
                                            // userService.setUser(result.source[0].key, result.source[0].data.email, password, result.source[0].data.token, result.source[0].data.contacts);
                                            this.setState({
                                                isLoading: false,
                                                done: true
                                            });
                                            messageService.showInfo(this.refs.flashMessage, i18nService.t(`new_password_sent_to_your_email`));
                                        }
                                    } else {
                                        this.props.navigation.goBack();
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
