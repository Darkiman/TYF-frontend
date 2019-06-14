import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl, Platform
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import {Icon, Text} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";
import themeService from "../../utils/themeService";
import i18nService from "../../utils/i18n/i18nService";
import userService from "../../utils/userService";
import messageService from "../../utils/messageService";
import _ from 'lodash';
import {NavigationEvents} from 'react-navigation';
import CustomSearchBar from "../../components/searchBar/searchBar";
import LinearGradient from "react-native-linear-gradient";
import ContactsList from "../../components/contactsList/contactsList";
import FlashMessage from "react-native-flash-message";
import CommonConstant from "../../constants/CommonConstant";

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
    personIconContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    headerText: {
        fontSize: 34,
        color: 'white',
        width: '100%',
        marginBottom: Platform.OS === 'ios' ? 5 : 0
    },
    icons: {
        ...sharedStyles.topIcons,
        width: '100%',
        position: 'relative',
        paddingRight: 0,
    }
};

export default class ContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            search: '',
            refreshing: false,

            contacts: [],
            contactsToShow: []
        };

        this.debounceSearch = _.debounce(this.searchContacts, 300);
    }

    componentDidMount() {
        if (this.props.getContacts) {
            userService.getUser().then(user => {
                this.user = user;
                this.props.getContacts(user.id).then(result => {
                    if (result.error) {
                        const errorText = i18nService.t(`validation_message.${result.message}`);
                        messageService.showError(errorText);
                    } else {
                        this.setState({
                            contacts: result.source.contacts,
                            contactsToShow: this.getContactsToShow(this.state.search, result.source.contacts).slice()
                        });
                    }
                })
            });
        }
    }

    handleSearchChange = (text) => {
        this.setState({
            search: text
        });
        this.debounceSearch();
    };

    handleClearClick = () => {
        this.setState({
            contactsToShow: this.state.contacts.slice(),
            search: ''
        })
    };

    searchContacts() {
        const contacts = this.getContactsToShow(this.state.search, this.state.contacts);
        this.setState({
            contactsToShow: contacts.slice()
        })
    }

    getContactsToShow(search, contacts) {
        const result = [];
        if (search) {
            for (let contact of contacts) {
                if (contact.data.name[0].toLowerCase().includes(search.toLowerCase())) {
                    result.push(contact);
                }
            }
            return result
        } else {
            return contacts;
        }
    }

    onRefresh = async () => {
        this.setState({refreshing: true});
        const result = await this.props.getContacts(this.user.id);
        if (result.error) {
            const errorText = i18nService.t(`validation_message.${result.message}`);
            messageService.showError(errorText);
        } else {
            this.setState({
                contacts: result.source.contacts.slice(),
                contactsToShow: this.getContactsToShow(this.state.search, result.source.contacts).slice(),
                refreshing: false
            });
        }
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
                        <NavigationEvents
                            onWillFocus={payload => {
                                this.setState({
                                    contacts: this.props.contacts,
                                    contactsToShow: this.getContactsToShow(this.state.search, this.props.contacts).slice()
                                })
                            }}
                        />
                        <View style={sharedStyles.contactsHeader}>
                            <View style={styles.icons}>
                                <Icon type={IconsType.Ionicon}
                                      name={`${this.iconPrefix}-person-add`}
                                      size={30}
                                      color={'white'}
                                      containerStyle={styles.personIconContainer}
                                      onPress={() => {
                                          if(contacts && contacts.length >= CommonConstant.CONTACTS_MAX_COUNT) {
                                              messageService.showError(this.refs.flashMessage, i18nService.t( 'cant_add_more_contacts', {max: CommonConstant.CONTACTS_MAX_COUNT}));
                                              return;
                                          }
                                          this.props.navigation.navigate(NavigationRoutes.SEARCH_CONTACTS);
                                          setTimeout(() => {
                                              this.setState({
                                                  contactsToShow: this.state.contacts.slice(),
                                                  search: ''
                                              });
                                          }, 500)
                                      }}
                                />
                            </View>
                            <Text style={styles.headerText}>{i18nService.t('navigation.contacts')}</Text>
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
                                        />
                                    }>
                            <ContactsList contacts={contacts}
                                          contactsToShow={this.state.contactsToShow}
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
