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
import {sharedStyles} from "../../shared/sharedStyles";
import SettingsList from 'react-native-settings-list';
import i18nService from '../../utils/i18n/i18nService';

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
            <SafeAreaView styles={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator /> : null}
                    {error ? <ErrorMessage /> : null}
                    <SettingsList borderColor='#c8c7cc'>
                        <SettingsList.Header headerStyle={{color:'white'}}/>
                        <SettingsList.Item
                            title={i18nService.t('language')}
                            onPress={() => {
                                this.props.navigation.navigate(NavigationRoutes.LANGUAGE_SETTINGS)
                            }}
                        />
                        <SettingsList.Item
                            title={i18nService.t('about_application')}
                            onPress={() => {
                                this.props.navigation.navigate(NavigationRoutes.ABOUT_SETTINGS)
                            }}
                        />
                    </SettingsList>
                </View>
            </SafeAreaView>
        );
    }
}
