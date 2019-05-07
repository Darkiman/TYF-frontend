import React, {Component} from 'react';
import {
    View,
    Button,
    Text,
    ActivityIndicator,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import NavigationRoutes from "../../constants/NavigationRoutes";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import {Header, Icon, SearchBar} from "react-native-elements";
import IconsType from "../../constants/IconsType";
import iconsService from "../../utils/iconsService";
import themeService from "../../utils/themeService";

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
    searchIconContainer: { marginTop: 1}
};

export default class ContactsView extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();

        this.state = {
            search: ''
        }
    }

    handleSearchChange = (text) => {
        this.setState({
            search: text
        });
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
                            placeholder="Type Here..."
                            onChangeText={this.handleSearchChange}
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
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
