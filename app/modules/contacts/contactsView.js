import React, {Component} from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import {ListItem, Icon, SearchBar} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";
import themeService from "../../utils/themeService";
import i18nService from "../../utils/i18n/i18nService";
import userService from "../../utils/userService";
import messageService from "../../utils/messageService";

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
        height: 60,
        width: '100%'
    },
    searchBarContainer: {
        flex: 1,
        height: 45,
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
        height: 45,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center'
    },
    personIconContainer: {marginRight: 10, marginTop: 2},
    searchIconContainer: { marginTop: 1, marginLeft: 4}
};

export default class ContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            search: '',
            refreshing: false,

            contacts: []
        }
    }

    componentDidMount() {
        if(this.props.getContacts) {
             userService.getUser().then(user => {
                 this.user = user;
                 this.props.getContacts(user.id).then(result => {
                     if(result.error) {
                         const errorText = i18nService.t(`validation_message.${result.message}`);
                         messageService.showError(errorText);
                     } else {
                         this.setState({
                             contacts: result.source.contacts
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
    };

    onRefresh = async () => {
        this.setState({refreshing: true});
        const result = await this.props.getContacts(this.user.id);
        if(result.error) {
            const errorText = i18nService.t(`validation_message.${result.message}`);
            messageService.showError(errorText);
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
                        <SearchBar
                            placeholder={i18nService.t('search')}
                            onChangeText={this.handleSearchChange}
                            value={this.state.search}
                            platform={'default'}
                            containerStyle={styles.searchBarContainer}
                            inputContainerStyle={styles.searchBarInput}
                            searchIcon={
                                <Icon type={IconsType.Ionicon}
                                      name={`${this.iconPrefix}-search`}
                                      size={30}
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
                               return <ListItem key={contact.key}
                                                title={contact.data.name}>
                                </ListItem>
                            })
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
