import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import {Icon, ListItem} from 'react-native-elements'
import i18nService from '../../utils/i18n/i18nService';
import userService from "../../utils/userService";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";
import themeService from "../../utils/themeService";

const colors = themeService.currentThemeColors;

const styles = {
  iconContainer: {
      width: 20
  }
};

export default class SettingsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            isLoading,
            error,
            data
        } = this.props;
        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage /> : null}
                    <ListItem
                        leftIcon={<Icon type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-globe`}
                                        containerStyle={styles.iconContainer}
                                        color={colors.textColor}
                                        underlayColor={'transparent'}/>}
                        title={i18nService.t('language')}
                        onPress={() => {
                            this.props.navigation.navigate(NavigationRoutes.LANGUAGE_SETTINGS, {
                                from: NavigationRoutes.SETTINGS,
                                update: () => {
                                    this.forceUpdate();
                                }
                            });
                        }}
                    />
                    <ListItem
                        leftIcon={<Icon type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-lock`}
                                        containerStyle={styles.iconContainer}
                                        color={colors.textColor}
                                        underlayColor={'transparent'}/>}
                        title={i18nService.t('confidentiality')}
                        onPress={() => {
                            this.props.navigation.navigate(NavigationRoutes.CONFIDENTIALITY_SETTINGS, {
                                from: NavigationRoutes.SETTINGS,
                                update: () => {
                                    this.forceUpdate();
                                }
                            });
                        }}
                    />
                    <ListItem
                        leftIcon={<Icon type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-information-circle`}
                                        containerStyle={styles.iconContainer}
                                        color={colors.textColor}
                                        underlayColor={'transparent'}/>}
                        title={i18nService.t('about_application')}
                        onPress={() => {
                            this.props.navigation.navigate(NavigationRoutes.ABOUT_SETTINGS);
                        }}
                    />
                    <ListItem
                        leftIcon={<Icon type={IconsType.Ionicon}
                                        name={`${this.iconPrefix}-exit`}
                                        containerStyle={styles.iconContainer}
                                        color={colors.textColor}
                                        underlayColor={'transparent'}/>}
                        title={i18nService.t('exit')}
                        onPress={async () => {
                            userService.deleteCurrentUser();
                            this.props.navigation.navigate(NavigationRoutes.AUTH);
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
