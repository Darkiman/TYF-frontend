import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import { Text} from "react-native-elements";
import iconsService from "../../../utils/iconsService";
import themeService from "../../../utils/themeService";
import i18nService from "../../../utils/i18n/i18nService";
import messageService from "../../../utils/messageService";
import _ from 'lodash';
import NavigationRoutes from "../../../constants/NavigationRoutes";
import FlashMessage from "react-native-flash-message";
import userService from "../../../utils/userService";
import CustomSearchBar from "../../../components/searchBar/searchBar";
import LinearGradient from "react-native-linear-gradient";
import ContactsList from "../../../components/contactsList/contactsList";
import NavigationBack from "../../../components/navigationBack/navigationBack";

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
    header: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        height: 125,
        width: '100%',
        backgroundColor: 'transparent',
        paddingLeft: 16,
        paddingRight: 16
    },
    headerText: {
        fontSize: 34,
        color: 'white',
        width: '100%',
        marginBottom: 5
    },
    backContainerStyle: {marginTop: 3, width: 35},
};

export default class SearchContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            search: '',
            refreshing: false,

            searchResult: [],
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
                searchResult: result.source.contacts,
            });
        }
    }

    onRefresh = async () => {
        this.setState({refreshing: true});
        if (this.state.search.length < 5) {
            this.setState({refreshing: false});
            return;
        }
        const result = await this.props.searchContacts(this.user.id, this.state.search);
        if (result.error) {
            const errorText = i18nService.t(`validation_message.${result.message}`);
            messageService.showError(errorText);
            this.setState({
                searchResult: [],
                refreshing: false
            });
        } else {
            this.setState({
                searchResult: result.source.contacts,
                refreshing: false
            });
        }
    };

    back = () => {
        this.props.navigation.navigate(NavigationRoutes.CONTACTS);
    };

    render() {
        const {
            isLoading,
            error,
            contacts,
            deleteContact,
            addContact
        } = this.props;
        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            start={sharedStyles.headerGradient.start}
                            end={sharedStyles.headerGradient.end}
                            colors={[sharedStyles.gradient.start, sharedStyles.gradient.end]}>
                <SafeAreaView style={{...styles.safeArea, backgroundColor: 'transparent'}}>
                    <View style={styles.mainView}>
                        <View style={styles.header}>
                            <NavigationBack style={{paddingLeft: 0}} onPress={() => {
                                this.back();
                            }}/>
                            <Text style={styles.headerText}>{i18nService.t('search_contacts')}</Text>
                            <View style={sharedStyles.contactsSearchBar}>
                                <CustomSearchBar
                                    placeholder={i18nService.t('search')}
                                    onChangeText={this.handleSearchChange}
                                    onClear={this.handleClearClick}
                                    value={this.state.search}
                                />
                            </View>
                        </View>
                        <ScrollView style={{backgroundColor: 'white'}}
                            refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}>
                            <ContactsList contacts={contacts}
                                          contactsToShow={this.state.searchResult}
                                          disableLeftSwipe={true}
                                          deleteContact={deleteContact}
                                          addContact={addContact}
                                          user={this.user}
                                          flashMessage={this.refs.flashMessage}>
                            </ContactsList>
                        </ScrollView>
                    </View>
                    <FlashMessage position="top" ref={'flashMessage'}/>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
