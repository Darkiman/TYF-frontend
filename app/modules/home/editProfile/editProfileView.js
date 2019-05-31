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
import NavigationRoutes from "../../../constants/NavigationRoutes";
import LargeButton from "../../../components/largeButton/largeButton";
import IconsType from "../../../constants/IconsType";
import {textInputStyle} from "../../../components/textInput/textInputStyle";
import TextInput from "../../../components/textInput/textInput";
import ModalOverlay from "../../../components/overlay/overlay";
import iconsService from "../../../utils/iconsService";
import CommonConstant from "../../../constants/CommonConstant";
import ProfileImage from "../../../components/profileImage/profileImage";

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
            nameChanged: false,
        };
    }

    componentDidMount() {
        this.initialize();
    }

    async initialize() {
        this.user = await userService.getUser();
        this.iconPrefix = this.iconPrefix = iconsService.getIconPrefix();
        this.setState({
            initialized: true,
            name: this.user.name
        })
    }

    handleNameChange = (text) => {
        const isNameValid = text && (text.length < 6 || text === this.user.name) ? false : true;
        this.setState({
            name: text,
            nameValid: isNameValid,
            nameChanged: true
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
            uploadAvatar
        } = this.props;
        const {
            name, nameValid, nameChanged, showNameTooltip
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
                                <View style={styles.view}>
                                    <ProfileImage style={styles.avatar}
                                                  avatar={this.user.avatar}
                                                  editable={true}
                                    >
                                    </ProfileImage>
                                    <TextInput ref={(ref) => this.nameRef = ref}
                                               name={'name'}
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
                                    <LargeButton title={i18nService.t('save_changes')}
                                                 disabled={isLoading || !nameValid || !nameChanged}
                                                 buttonStyle={{
                                                     marginTop: 72,
                                                     marginBottom: 20
                                                 }}
                                                 onPress={() => {
                                                     this.props.navigation.navigate(NavigationRoutes.AUTH_LOGIN)
                                                 }}
                                    />
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
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
