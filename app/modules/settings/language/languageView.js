import React, {Component} from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator,
    SafeAreaView, Platform
} from 'react-native';
import ErrorMessage from "../../../components/ErrorMessage";
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {ListItem, Icon} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import iconsService from "../../../utils/iconsService";
import IconsType from "../../../constants/IconsType";

export default class LanguageView extends Component {
    constructor(props) {
        super(props);
        this.supportedLanguages = i18nService.getSupportedLanguages();
        this.currentLocale = i18nService.getCurrentLocale();
        this.iconPrefix = iconsService.getIconPrefix();
        this.from = null;
        this.update = null;
        this.iconSize = Platform.OS === 'ios' ? 40 : 25 ;
    }

    setLocale = async (item) => {
        await i18nService.setLocale(item.key);
        if(this.update) {
            this.update();
        }
        // add date param to rerender stack navigator
        this.props.navigation.navigate(this.from,{date: new Date()});
    };

    render() {
        const {
            isLoading,
            error,
            navigation
        } = this.props;
        this.from = navigation.getParam('from');
        this.update = navigation.getParam('update');

        return (
            <SafeAreaView style={sharedStyles.safeView}>
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
                                rightIcon={this.currentLocale === item.key ?
                                    <Icon type={IconsType.Ionicon}
                                          name={`${this.iconPrefix}-checkmark`}
                                          size={this.iconSize}
                                    /> : {}}
                            />
                        }
                    })}
                </View>
            </SafeAreaView>
        );
    }
}
