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
        if(!networkService.isConnected) {
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
            const result =  {
                source: error,
                error: true,
                message: text
            };
            return result;
        }
    };

    render() {
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={sharedStyles.centredColumn}>
                    <View style={{width: '90%'}}>
                        <TextInput name={'email'}
                                   placeholder={i18nService.t('email')}
                                   disabled={this.state.isLoading}
                                   icon={'mail'}
                                   value={this.state.recover.email}
                                   maxLength={40}
                                   valid={this.state.emailValid}
                                   onChangeText={this.handleEmailChange}
                        />
                    </View>
                    <View style={{width: '90%'}}>
                        <LargeButton title={this.state.done ? i18nService.t('go_to_login') : i18nService.t('recover_password')}
                                     buttonStyle={{marginTop: 20}}
                                     loading={this.state.isLoading}
                                     disabled={!this.state.emailValid}
                                     onPress={async () => {
                                         if(!this.state.done && !this.state.isLoading) {
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
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </View>
            </SafeAreaView>
        );
    }
}
