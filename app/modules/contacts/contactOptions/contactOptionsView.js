import React, {Component} from 'react';
import {
    View,
    SafeAreaView
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Icon, Input, ListItem, Text} from "react-native-elements";
import iconsService from "../../../utils/iconsService";
import themeService from "../../../utils/themeService";
import _ from 'lodash';
import NavigationRoutes from "../../../constants/NavigationRoutes";
import FlashMessage from "react-native-flash-message";
import userService from "../../../utils/userService";
import i18nService from '../../../utils/i18n/i18nService';
import CommonConstant from "../../../constants/CommonConstant";
import IconsType from "../../../constants/IconsType";
import {textInputStyle} from "../../../components/textInput/textInputStyle";
import TextInput from "../../../components/textInput/textInput";

const colors = themeService.currentThemeColors;

const styles = {
    safeArea: {
        ...sharedStyles.safeView,
        backgroundColor: colors.backgroundColor
    },
    mainView: {
        backgroundColor: 'transparent',
        flex: 1
    },
    headerText: {
        fontSize: 34,
        color: 'white',
        width: '100%',
        marginTop: 5,
        marginBottom: 5
    },
    backContainerStyle: {marginTop: 3, width: 35},
    emptyTextContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 20
    },
    emptyText: {
        textAlign: 'center', color: colors.textLightColor
    }
};

export default class ContactOptionsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            enableNotifications: false,
            distance: 5,
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

    handleDistanceChange = () => {

    };

    render() {
        const {
            isLoading,
            error,
        } = this.props;
        const {enableNotifications, distance, showDistanceTooltip} = this.state;
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View style={{...styles.mainView, paddingRight: 16}}>
                    <ListItem
                        containerStyle={{
                            height: 80,
                            paddingRight: 0
                        }}
                        titleStyle={{
                            fontSize: 18,
                            marginLeft: 10
                        }}
                        title={i18nService.t('enable_notification')}
                        switch={{
                            onValueChange: this.onNotificationChange,
                            value: enableNotifications
                        }}
                    >
                    </ListItem>
                    {
                        enableNotifications ? <TextInput name={'distance'}
                                                         style={'outline'}
                                                         placeholder={i18nService.t('Distance')}
                                                         icon={'lock'}
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
                </View>
                <FlashMessage position="top" ref={'flashMessage'}/>
            </SafeAreaView>
        );
    }
}
