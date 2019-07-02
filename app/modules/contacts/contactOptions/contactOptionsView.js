import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    Image
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
        backgroundColor: 'white'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 16,
        paddingLeft: 16,
    },
    headerText: {
        marginTop: 10,
        fontSize: 19,
        marginBottom: 12,
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

        this.state = {
            enableNotifications: false,
            distance: '',
            showDistanceTooltip: false
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

    onNotificationChange = (value) => {
        this.setState({
            enableNotifications: value
        })
    };

    handleDistanceChange = (value) => {
        const valid = onlyNumberRegex.test(value);
        if (valid) {
            this.setState({
                distance: value
            })
        }
    };

    render() {
        const {
            isLoading,
            error,
        } = this.props;
        const {enableNotifications, distance, showDistanceTooltip} = this.state;
        const data = this.props.navigation.getParam('data');
        const avatar = data && data.avatar ? `${apiConfig.static}avatars/${data.avatar}` : `${apiConfig.static}avatars/default.jpg`;
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
                            <Text style={styles.headerText}>{data.name[0]}</Text>
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
