import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import ErrorMessage from "../../components/ErrorMessage";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import { ListItem } from 'react-native-elements'
import i18nService from '../../utils/i18n/i18nService';
import userService from "../../utils/userService";

export default class SettingsView extends Component {
    constructor(props) {
        super(props);
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
                        title={i18nService.t('about_application')}
                        onPress={() => {
                            this.props.navigation.navigate(NavigationRoutes.ABOUT_SETTINGS);
                        }}
                    />
                    <ListItem
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
