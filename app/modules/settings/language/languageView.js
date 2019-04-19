import React, {Component} from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import NavigationRoutes from "../../../constants/NavigationRoutes";
import ErrorMessage from "../../../components/ErrorMessage";
import {sharedStyles} from "../../../shared/sharedStyles";
import {ListItem} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";

export default class LanguageView extends Component {
    constructor(props) {
        super(props);
        this.supportedLanguages = i18nService.getSupportedLanguages();
    }

    setLocale = async (item) => {
        await i18nService.setLocale(item.key);
        this.props.navigation.navigate(NavigationRoutes.HOME);
    };

    render() {
        const {
            isLoading,
            error
        } = this.props;
        return (
            <SafeAreaView styles={sharedStyles.safeView}>
                <View>
                    {isLoading ? <ActivityIndicator/> : null}
                    {error ? <ErrorMessage/> : null}
                    {this.supportedLanguages.map((item, index) => {
                        {
                            return <ListItem
                                key={index}
                                title={i18nService.t(item.translationKey, {locale: item.key})}
                                onPress={async () => {
                                    this.setLocale(item)}
                                }
                            />
                        }
                    })}
                </View>
            </SafeAreaView>
        );
    }
}
