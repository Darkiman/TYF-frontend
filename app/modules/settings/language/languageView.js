import React, {Component} from 'react';
import {
    View,
    SafeAreaView, Platform
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {ListItem, Icon} from 'react-native-elements';
import i18nService from "../../../utils/i18n/i18nService";
import iconsService from "../../../utils/iconsService";
import IconsType from "../../../constants/IconsType";
import userService from "../../../utils/userService";
import LargeButton from '../../../components/largeButton/largeButton';
import themeService from "../../../utils/themeService";
import ShortCutsService from "../../../utils/shortCutsService";

const colors = themeService.currentThemeColors;

export default class LanguageView extends Component {
    constructor(props) {
        super(props);
        this.supportedLanguages = i18nService.getSupportedLanguages();
        this.currentLocale = i18nService.getCurrentLocale();
        this.iconPrefix = iconsService.getIconPrefix();
        this.from = null;
        this.update = null;
        this.iconSize = Platform.OS === 'ios' ? 40 : 25;

        this.state = {
            changed: false,
            currentLocale: this.currentLocale
        }
    }

    componentDidMount() {
        this.user = userService.getUser();
        this.initialize();
    }

    async initialize() {
        this.user = await userService.getUser();
    }

    selectLocale = async (item) => {
        this.setState({
            currentLocale: item.key,
            changed: true
        });
    };

    save = async () => {
        const { currentLocale } = this.state;
        if(this.user) {
            await this.props.changeLanguage(this.user.id, currentLocale);
        }
        if(this.update) {
            this.update();
        }
        // add date param to rerender stack navigator
        await i18nService.setLocale(currentLocale);
        this.props.navigation.navigate(this.from, {date: new Date()});
        if(ShortCutsService.initialized) {
            ShortCutsService.setShortCuts();
        }
    };

    render() {
        const {
            isLoading,
            navigation
        } = this.props;
        const { changed, currentLocale } = this.state;
        this.from = navigation.getParam('from');
        this.update = navigation.getParam('update');

        return (
            <SafeAreaView style={sharedStyles.safeView}>
                <View>
                    {this.supportedLanguages.map((item, index) => {
                        {
                            return <ListItem
                                key={index}
                                containerStyle={{height: 70}}
                                title={i18nService.t(item.translationKey, {locale: item.key})}
                                onPress={async () => {
                                    this.selectLocale(item)
                                }}
                                rightIcon={currentLocale === item.key ?
                                    <Icon type={IconsType.Ionicon}
                                          name={`${this.iconPrefix}-checkmark`}
                                          size={this.iconSize}
                                    /> : {}}
                            />
                        }
                    })}
                    <View style={{width: '100%', paddingLeft: 16, paddingRight: 16}}>
                        <LargeButton type={'solid'}
                                     title={i18nService.t('save', {locale: currentLocale})}
                                     disabled={!changed}
                                     buttonStyle={{
                                         marginTop: 20,
                                         backgroundColor: colors.backgroundColor
                                     }}
                                     titleStyle={{
                                         color: 'white'
                                     }}
                                     loading={isLoading}
                                     onPress={async () => {
                                        await this.save();
                                     }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
