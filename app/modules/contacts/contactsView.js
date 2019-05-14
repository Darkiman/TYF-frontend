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
                            contactsToShow: this.getContactsToShow(this.state.search, result.source.contacts)
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
            contactsToShow: this.state.contacts
        })
    };

    searchContacts() {
        const contacts = this.getContactsToShow(this.state.search, this.state.contacts);
        this.setState({
            contactsToShow: contacts
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
                contacts: result.source.contacts,
                contactsToShow: this.getContactsToShow(this.state.search, result.source.contacts),
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
                                  this.props.navigation.navigate(NavigationRoutes.SEARCH_CONTACTS)
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
                                return <ContactItem key={contact.key}
                                                    title={contact.data.name[0]}
                                                    data={contact}
                                                    showDelete={!contact.data.deleted}
                                                    showAdd={contact.data.deleted}
                                                    onDelete={async () => {
                                                        const result = await this.props.deleteContact(this.user.id, contact.key);
                                                        if (result.error) {
                                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                                            messageService.showError(errorText);
                                                        } else {
                                                            contact.data.deleted = true;
                                                        }
                                                    }}
                                                    onAdd={async () => {
                                                        const result = await this.props.deleteContact(this.user.id, contact.key);
                                                        if (result.error) {
                                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                                            messageService.showError(errorText);
                                                        } else {
                                                            contact.data.false = true;
                                                        }
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
