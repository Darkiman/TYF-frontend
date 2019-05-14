import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import {Icon, SearchBar} from "react-native-elements";
import IconsType from "../../../constants/IconsType";
import iconsService from "../../../utils/iconsService";
import themeService from "../../../utils/themeService";
import i18nService from "../../../utils/i18n/i18nService";
import messageService from "../../../utils/messageService";
import _ from 'lodash';
import NavigationRoutes from "../../../constants/NavigationRoutes";
import FlashMessage from "react-native-flash-message";
import userService from "../../../utils/userService";
import ContactItem from "../../../components/contacItem/contactItem";

const colors = themeService.currentThemeColors;

const styles = {
    safeArea: {
        ...sharedStyles.safeView,
        backgroundColor: colors.backgroundColor
    },
    mainView: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        backgroundColor: '#2eb0fb',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 45,
        width: '100%'
    },
    searchBarContainer: {
        flex: 1,
        height: 30,
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 2
    },
    searchBarInput: {
        height: 30,
        backgroundColor: 'white',
        borderRadius: 50,
    },
    backContainerStyle: {marginTop: 3, width: 35},
    searchIconContainer: {marginTop: 1}
};

export default class SearchContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            search: '',
            refreshing: false,

            contacts: [],
        };

        this.debounceSearch = _.debounce(this.searchContacts, 300);
    }

    componentDidMount() {
        userService.getUser().then(user => {
            this.user = user;
        });
    }

    handleSearchChange = (text) => {
        this.setState({
            search: text
        });
        this.debounceSearch();
    };

    async searchContacts() {
        if (this.state.search.length < 5) {
            return;
        }
        const result = await this.props.searchContacts(this.user.id, this.state.search);
        if (result.error) {
            const errorText = i18nService.t(`validation_message.${result.message}`);
            messageService.showError(errorText);
        } else {
            this.setState({
                contacts: result.source.contacts,
            });
        }
    }

    onRefresh = async () => {
        this.setState({refreshing: true});
        const result = await this.props.searchContacts(this.user.id, this.state.search);
        if (result.error) {
            const errorText = i18nService.t(`validation_message.${result.message}`);
            messageService.showError(errorText);
            this.setState({
                contacts: [],
                refreshing: false
            });
        } else {
            this.setState({
                contacts: result.source.contacts,
                refreshing: false
            });
        }
    };

    render() {
        const {
            isLoading,
            error
        } = this.props;
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.mainView}>
                    <View style={styles.header}>
                        <Icon type={IconsType.Evilicon}
                              name={`chevron-left`}
                              size={45}
                              color={'white'}
                              containerStyle={styles.backContainerStyle}
                              onPress={() => {
                                  this.props.navigation.navigate(NavigationRoutes.CONTACTS);
                              }}/>
                        <SearchBar
                            placeholder={i18nService.t('search_friends')}
                            onChangeText={this.handleSearchChange}
                            onClear={this.handleClearClick}
                            value={this.state.search}
                            platform={'default'}
                            containerStyle={styles.searchBarContainer}
                            inputContainerStyle={styles.searchBarInput}
                            searchIcon={
                                <Icon type={IconsType.Ionicon}
                                      name={`${this.iconPrefix}-search`}
                                      size={25}
                                      color={'#86939e'}
                                      containerStyle={styles.searchIconContainer}
                                />
                            }
                        />
                    </View>
                    <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                    >
                        {
                            this.state.contacts.map(contact => {
                                return <ContactItem key={contact.key}
                                                    title={contact.data.name[0]}
                                                    showAdd={true}>
                                </ContactItem>
                            })
                        }
                        <FlashMessage position="top"/>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
