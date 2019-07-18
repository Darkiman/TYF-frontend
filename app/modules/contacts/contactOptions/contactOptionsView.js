import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Icon, ListItem, Text} from "react-native-elements";
import iconsService from "../../../utils/iconsService";
import NavigationRoutes from "../../../constants/NavigationRoutes";
import FlashMessage from "react-native-flash-message";
import userService from "../../../utils/userService";
import i18nService from '../../../utils/i18n/i18nService';
import IconsType from "../../../constants/IconsType";
import TextInput from "../../../components/textInput/textInput";
import ModalOverlay from "../../../components/overlay/overlay";
import imageCacheHoc from "react-native-image-cache-hoc";
import themeService from "../../../utils/themeService";
import apiConfig from "../../../utils/apiConfig";
import LinearGradient from "react-native-linear-gradient";
import LargeButton from "../../../components/largeButton/largeButton";
import messageService from "../../../utils/messageService";
import PermissionsService from "../../../utils/permissionsService";

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https']
});
const colors = themeService.currentThemeColors;
const onlyNumberRegex = /^[0-9]{0,6}$/;

const defaultImg = require('../../../assets/images/avatar.jpg');

const styles = {
    safeArea: {
        ...sharedStyles.safeView,
        backgroundColor: colors.backgroundColor
    },
    mainView: {
        backgroundColor: 'transparent',
        flex: 1
    },
    container: {
        paddingRight: 16,
        paddingLeft: 16,
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingLeft: 16,
        paddingTop: 11
    },
    headerText: {
        marginTop: 5,
        fontSize: 19,
        marginBottom: 5,
        color: 'white'
    },
    contactContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backContainerStyle: {
        marginTop: 3,
        width: 35
    },
    emptyTextContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 20
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textLightColor
    },
    switchContainer: {
        height: 80,
        paddingRight: 0,
        paddingLeft: 0
    },
    switchTitle: {
        fontSize: 18,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45
    },
    showHistoryContainer: {
        width: '100%',
        marginBottom: 10,
        height: 70,
        backgroundColor: 'black'
    },
    historyTouchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    historyText: {
        color: 'white'
    }
};

const propOverridePlaceholderObject = {
    component: Image,
    props: {
        style: styles.avatar,
        source: defaultImg
    }
};

export default class ContactOptionsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.data = this.props.navigation.getParam('data');
        this.contactId = this.props.navigation.getParam('id');
        console.log(this.data);
        this.state = {
            dontShowPosition: this.data && this.data.options ? this.data.options.dontShowPosition : false,
            dontShowHistory: this.data && this.data.options ? this.data.options.dontShowHistory : false,
            enableNotifications: this.data && this.data.options ? this.data.options.enableNotifications : false,
            distance: this.data && this.data.options ? this.data.options.distance : '',
            showDistanceTooltip: false,
            changed: false
        };

    }

    componentDidMount() {
        userService.getUser().then(user => {
            this.user = user;
        });
    }

    back = () => {
        this.props.navigation.navigate(NavigationRoutes.CONTACTS);
    };

    handlePositionOptionChange = (value) => {
        this.setState({
            dontShowPosition: value,
            changed: true
        });
    };

    handleHistoryOptionChange = (value) => {
        this.setState({
            dontShowHistory: value,
            changed: true
        });
    };

    onNotificationChange = async (value) => {
        if(value && Platform.OS === 'ios') {
            const response = await PermissionsService.checkNotificationPermissions();
            console.log(response);
            if(response === 'undetermined') {
                const notificationsResponse = await PermissionsService.enableNotifications();
                if(notificationsResponse !== 'authorized') {
                    await PermissionsService.enableNotificationsFromSettings();
                    return
                }
            }
            if(response === 'denied') {
                await PermissionsService.enableNotificationsFromSettings();
                return;
            }
        }
        this.setState({
            enableNotifications: value,
            changed: true
        });
    };

    handleDistanceChange = (value) => {
        const valid = onlyNumberRegex.test(value);
        if (valid) {
            this.setState({
                distance: value,
                changed: true
            })
        }
    };

    save = async () => {
        try {
            const {dontShowPosition, enableNotifications, distance} = this.state;
            const result = await this.props.saveContactOptions(this.user.id, this.contactId, dontShowPosition, enableNotifications, distance);
            if (result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
            } else {
                this.props.navigation.goBack();
            }
        } catch (e) {

        }
    };

    render() {
        const {
            isLoading,
            error,
        } = this.props;
        const {dontShowPosition, enableNotifications, distance, showDistanceTooltip, dontShowHistory, changed} = this.state;
        const avatar = this.data && this.data.avatar ? `${apiConfig.static}avatars/${this.data.avatar}` : `${apiConfig.static}avatars/default.jpg`;
        const name = this.data && this.data.name[0];
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            start={sharedStyles.headerGradient.start}
                            end={sharedStyles.headerGradient.end}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={sharedStyles.safeView}>
                    <View style={styles.header}>
                        <Icon type={IconsType.Ionicon}
                              name={`${this.iconPrefix}-arrow-back`}
                              size={35}
                              color={'white'}
                              underlayColor={'transparent'}
                              onPress={this.back}
                        />
                        <View style={styles.contactContainer}>
                            <CacheableImage source={{uri: avatar}}
                                            style={styles.avatar}
                                            placeholder={propOverridePlaceholderObject}/>
                            <Text style={styles.headerText}>{name}</Text>
                        </View>
                        <Icon type={IconsType.Ionicon}
                              name={`${this.iconPrefix}-arrow-back`}
                              size={35}
                              color={'transparent'}
                              underlayColor={'transparent'}
                            // onPress={this.back}
                        />
                    </View>
                    <View style={{...styles.mainView, ...styles.container}}>
                        <View>
                            <ListItem
                                containerStyle={styles.switchContainer}
                                titleStyle={styles.switchTitle}
                                title={i18nService.t('dont_show_position_on_map_for_this_contact')}
                                switch={{
                                    onValueChange: this.handlePositionOptionChange,
                                    value: dontShowPosition
                                }}
                            >
                            </ListItem>
                            <ListItem
                                containerStyle={styles.switchContainer}
                                titleStyle={styles.switchTitle}
                                title={i18nService.t('dont_show_history_for_this_contact')}
                                switch={{
                                    onValueChange: this.handleHistoryOptionChange,
                                    value: dontShowHistory
                                }}
                            >
                            </ListItem>
                            <ListItem
                                containerStyle={styles.switchContainer}
                                titleStyle={styles.switchTitle}
                                title={i18nService.t('enable_notification')}
                                switch={{
                                    onValueChange: this.onNotificationChange,
                                    value: enableNotifications
                                }}
                            >
                            </ListItem>
                            {
                                enableNotifications ? <TextInput name={'distance'}
                                                                 type={'outline'}
                                                                 placeholder={i18nService.t('distance')}
                                                                 icon={'resize'}
                                                                 iconContainerStyle={{transform: [{rotate: '90deg'}]}}
                                                                 value={distance}
                                                                 maxLength={6}
                                                                 keyboardType={'numeric'}
                                                                 onChangeText={this.handleDistanceChange}
                                                                 rightIcon={
                                                                     <Icon
                                                                         type={IconsType.Ionicon}
                                                                         name={`${this.iconPrefix}-${'help-circle-outline'}`}
                                                                         size={24}
                                                                         color={colors.textLightColor}
                                                                         underlayColor={'transparent'}
                                                                         onPress={() => {
                                                                             this.setState({
                                                                                 showDistanceTooltip: !showDistanceTooltip
                                                                             })
                                                                         }}
                                                                     />
                                                                 }
                                /> : null
                            }
                            {
                                changed ? <LargeButton type={'solid'}
                                                       title={i18nService.t('save')}
                                                       disabled={enableNotifications ? !distance || distance == 0 : !changed}
                                                       buttonStyle={{
                                                           marginTop: 40,
                                                           backgroundColor: colors.backgroundColor
                                                       }}
                                                       titleStyle={{
                                                           color: 'white'
                                                       }}
                                                       loading={isLoading}
                                                       loadingProps={{color: 'white'}}
                                                       onPress={async () => {
                                                           if(!isLoading) {
                                                               await this.save();
                                                           }
                                                       }}
                                /> : null
                            }
                        </View>
                        {
                            <View style={styles.showHistoryContainer}>
                                <TouchableOpacity style={styles.historyTouchable} onPress={() => {
                                    this.props.navigation.navigate(NavigationRoutes.HISTORY_MAP);
                                }}>
                                    <Text style={styles.historyText}>{i18nService.t('show_history')}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <ModalOverlay
                            isVisible={showDistanceTooltip}
                            onBackdropPress={() => {
                                this.setState({
                                    showDistanceTooltip: !showDistanceTooltip
                                })
                            }}>
                            <Text>{i18nService.t('set_distance_value')}</Text>
                        </ModalOverlay>
                    </View>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
