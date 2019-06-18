import React, {Component} from 'react';
import {
    View, SafeAreaView
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import userService from "../../../utils/userService";
import LinearGradient from "react-native-linear-gradient";
import {Icon, Text} from 'react-native-elements';
import NavigationBack from "../../../components/navigationBack/navigationBack";
import i18nService from "../../../utils/i18n/i18nService";
import LargeButton from "../../../components/largeButton/largeButton";
import IconsType from "../../../constants/IconsType";
import {textInputStyle} from "../../../components/textInput/textInputStyle";
import TextInput from "../../../components/textInput/textInput";
import ModalOverlay from "../../../components/overlay/overlay";
import iconsService from "../../../utils/iconsService";
import CommonConstant from "../../../constants/CommonConstant";
import ProfileImage from "../../../components/profileImage/profileImage";
import commonService from "../../../services/commonService";
import FlashMessage from "react-native-flash-message";
import messageService from "../../../utils/messageService";
import {NavigationEvents} from "react-navigation";

const styles = {
    view: {
        height: '100%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        marginBottom: 71
    }
};

export default class EditProfileView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showNameTooltip: false,
            showPasswordTooltip: false,
            changePassword: false,
            passwordValid: true,
            nameValid: true,
            nameChanged: false,

            imageLoading: false,
        };
    }

    componentDidMount() {
        this.initialize();
    }

    async initialize() {
        this.user = await userService.getUser();
        this.iconPrefix = iconsService.getIconPrefix();
        this.setState({
            initialized: true,
            name: this.user.name,
            password: ''
        })
    }

    handleNameChange = (text) => {
        const isNameValid = !text || text.length < CommonConstant.MIN_NAME_LENGTH ? false : true;
        this.setState({
            name: text,
            nameValid: isNameValid,
            nameChanged: true
        });
    };

    handlePasswordChange = (text) => {
        const isPasswordValid = commonService.validatePassword(text) || text === '';
        this.setState({
            password: text,
            passwordValid: isPasswordValid
        });
    };

    saveChanges = async () => {
        const {changeInfo} = this.props;
        const {name, password} = this.state;
        try {
            const result = await changeInfo(this.user.id, this.profileImageRef.state.response, name, password, i18nService.getCurrentLocale());
            if(result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
            } else {
                let updatedUser = {...this.user, ... result.source.user.data};
                updatedUser.name = updatedUser.name[0];
                await userService.setUser(updatedUser);
                const update = this.props.navigation.getParam('update');
                if(update) {
                    update();
                }
                this.back();
            }
        } catch (e) {
            messageService.showError(this.refs.flashMessage, i18nService.t('error_while_saving_data'));
        }
    };

    back = () => {
        this.props.navigation.goBack();
    };

    render() {
        const {
            isLoading,
        } = this.props;
        const {
            name, nameValid, passwordValid, nameChanged, showNameTooltip, changePassword, imageLoading
        } = this.state;
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                    <NavigationBack onPress={() => {
                        this.back();
                    }}/>
                    {
                        this.state.initialized ?
                            <View style={sharedStyles.centredColumn}>
                                <NavigationEvents
                                    onWillFocus={payload => {
                                        this.forceUpdate();
                                    }}
                                />
                                <View style={styles.view}>
                                    <ProfileImage ref={(ref) => this.profileImageRef = ref}
                                                  style={styles.avatar}
                                                  user={this.user}
                                                  editable={true}
                                                  stateChanged={(value) => {
                                                      this.setState({
                                                          imageLoading: value
                                                      })
                                                  }}
                                                  showError={(text) => {
                                                      messageService.showError(this.refs.flashMessage, text);
                                                  }}>
                                    </ProfileImage>
                                    <TextInput name={'name'}
                                               placeholder={i18nService.t('name')}
                                               disabled={isLoading || !nameValid || !nameChanged}
                                               icon={'contact'}
                                               value={name}
                                               maxLength={CommonConstant.MAX_NAME_LENGTH}
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
                                                               showNameTooltip: !showNameTooltip
                                                           })
                                                       }}
                                                   />
                                               }
                                    />
                                    {
                                        changePassword ? <TextInput name={'password'}
                                                                    placeholder={i18nService.t('new_password')}
                                                                    disabled={isLoading}
                                                                    icon={'lock'}
                                                                    secureTextEntry={true}
                                                                    value={this.state.password}
                                                                    maxLength={CommonConstant.MAX_PASSWORD_LENGTH}
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
                                                                    }/> :
                                            <View style={{width: '100%', height: 53, alignItems: 'center'}}>
                                                <LargeButton type={'clear'}
                                                             buttonStyle={{width: 250}}
                                                             title={i18nService.t('type_here_to_change_password')}
                                                             onPress={() => {
                                                                 this.setState({
                                                                     changePassword: true
                                                                 })
                                                             }}
                                                />
                                            </View>
                                    }
                                    <View style={{width: '100%', height: 50}}>
                                        <LargeButton title={i18nService.t('save_changes')}
                                                     disabled={isLoading || imageLoading || !nameValid || !passwordValid}
                                                     loading={isLoading}
                                                     buttonStyle={{
                                                         marginTop: 72,
                                                         marginBottom: 20,
                                                     }}
                                                     onPress={this.saveChanges}
                                        />
                                    </View>
                                </View>
                            </View> : null
                    }
                    <ModalOverlay
                        isVisible={showNameTooltip}
                        onBackdropPress={() => {
                            this.setState({
                                showNameTooltip: !showNameTooltip
                            })
                        }}>
                        <Text>{i18nService.t('validation_message.name_should_be_more_symbols', {symbols: CommonConstant.MIN_NAME_LENGTH})}</Text>
                    </ModalOverlay>
                    <ModalOverlay
                        isVisible={this.state.showPasswordTooltip}
                        onBackdropPress={() => {
                            this.setState({
                                showPasswordTooltip: !this.state.showPasswordTooltip
                            })
                        }}>
                        <Text
                            style={{fontSize: 16}}>{i18nService.t('validation_message.password_requirements', {symbols: CommonConstant.MIN_PASSWORD_LENGTH})}</Text>
                    </ModalOverlay>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
