import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import {Icon, SearchBar} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";
import themeService from "../../utils/themeService";
import i18nService from "../../utils/i18n/i18nService";
import userService from "../../utils/userService";
import messageService from "../../utils/messageService";
import _ from 'lodash';
import ContactItem from "../../components/contacItem/contactItem";
import { NavigationEvents } from 'react-navigation';
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
        justifyContent: 'space-between',
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
    personIconContainer: {marginRight: 10, marginTop: 2},
    searchIconContainer: {marginTop: 1}
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
            contactsToShow: this.state.contacts,
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
            contacts
        } = this.props;
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.mainView}>
                    <NavigationEvents
                        onWillFocus={payload => {
                            this.setState({
                                contacts: this.props.contacts,
                                contactsToShow: this.getContactsToShow(this.state.search, this.props.contacts)
                            })
                        }}
                    />
                    <View style={styles.header}>
                        <SearchBar
                            placeholder={i18nService.t('search')}
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
                        <Icon type={IconsType.Ionicon}
                              name={`${this.iconPrefix}-person-add`}
                              size={30}
                              color={'white'}
                              containerStyle={styles.personIconContainer}
                              onPress={() => {
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
                    <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />}
                    >
                        {
                            this.state.contactsToShow.map(contact => {
                                const isInContacts = contacts && contacts.find(item => item.key === contact.key);
                                return <ContactItem key={contact.key}
                                                    title={contact.data.name[0]}
                                                    data={contact}
                                                    showDelete={isInContacts && !contact.data.loading}
                                                    showAdd={!isInContacts && !contact.data.loading}
                                                    loading={contact.data.loading}
                                                    onDelete={async () => {
                                                        contact.data.loading = true;
                                                        this.forceUpdate();
                                                        const result = await this.props.deleteContact(this.user.id, contact.key);
                                                        if (result.error) {
                                                            contact.data.loading = false;
                                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                                            messageService.showError(errorText);
                                                        } else {
                                                            contact.data.loading = false;
                                                        }
                                                        this.forceUpdate();
                                                    }}
                                                    onAdd={async () => {
                                                        contact.data.loading = true;
                                                        this.forceUpdate();
                                                        const result = await this.props.addContact(this.user.id, contact.key);
                                                        if (result.error) {
                                                            contact.data.loading = false;
                                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                                            messageService.showError(errorText);
                                                        } else {
                                                            contact.data.loading = false;
                                                        }
                                                        this.forceUpdate();
                                                    }}>
                                </ContactItem>
                            })
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
