import React, {Component} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl
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
import ContactItem from "../../components/contacItem/contactItem";
import {NavigationEvents} from 'react-navigation';
import CustomSearchBar from "../../components/searchBar/searchBar";
import LinearGradient from "react-native-linear-gradient";
import { SwipeListView } from 'react-native-swipe-list-view';

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
    personIconContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    headerText: {
        fontSize: 34,
        color: 'white',
        width: '100%',
        marginBottom: 5
    },
    icons: {
        width: '100%',
        position: 'relative'
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
            contacts
        } = this.props;

        return (
            <LinearGradient style={{...sharedStyles.safeView}}
                            start={{x: 1, y: 0.3}} end={{x: 0, y: 0}}
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
                        <View style={styles.header}>
                            <View style={styles.icons}>
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
                            <Text style={styles.headerText}>{i18nService.t('navigation.contacts')}</Text>
                            <View style={{width: '100%', height: 55}}>
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
                            <SwipeListView
                                useFlatList
                                stopLeftSwipe={300}
                                stopRightSwipe={-100}
                                leftOpenValue={75}
                                rightOpenValue={-75}
                                disableRightSwipe={true}
                                data={this.state.contactsToShow}
                                renderItem={ (data, rowMap) => {
                                    const contact = data.item;
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
                                }}
                                renderHiddenItem={ (data, rowMap) => (
                                    <View>
                                        <Text>Left</Text>
                                        <Text>Right</Text>
                                    </View>
                                )}
                            />
                            {
                                this.state.contactsToShow.map(contact => {

                                })
                            }
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }
}
