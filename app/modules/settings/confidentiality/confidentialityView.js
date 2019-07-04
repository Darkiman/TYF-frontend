import React, {Component} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image
} from 'react-native';
import {sharedStyles} from "../../../shared/styles/sharedStyles";
import i18nService from "../../../utils/i18n/i18nService";
import {ListItem} from "react-native-elements";
import LargeButton from "../../../components/largeButton/largeButton";
import themeService from "../../../utils/themeService";
import userService from "../../../utils/userService";
import messageService from "../../../utils/messageService";
import FlashMessage from "react-native-flash-message";

const colors = themeService.currentThemeColors;
const styles = {
    safeArea: {
        ...sharedStyles.safeView,
        backgroundColor: colors.backgroundColor
    },
    mainView: {
        backgroundColor: 'transparent',
        flex: 1,
        paddingRight: 16,
        paddingLeft: 16,
    },
    emptyTextContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 20
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textLightColor
    },
    switchContainer: {
        height: 70,
        paddingRight: 0,
        paddingLeft: 0
    },
    switchTitle: {
        fontSize: 16,
    },
};

export default class Confidentiality extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPositionOnMap: true,
            showPositionOnlyToContacts: true,
            changed: false
        }
    }

    componentDidMount() {
        userService.getUser().then((user) => {
            this.user = user;
            if (user.confidentiality) {
                this.setState({
                    showPositionOnMap: user.confidentiality.showPositionOnMap,
                    showPositionOnlyToContacts: user.confidentiality.showPositionOnlyToContacts
                })
            }
        });
    }

    back = () => {
        this.props.navigation.goBack();
    };

    handleShowPositionOnMapChange = (value) => {
        this.setState({
            showPositionOnMap: value,
            changed: true
        })
    };

    handleShowPositionOnlyToContactsChange = (value) => {
        this.setState({
            showPositionOnlyToContacts: value,
            changed: true
        })
    };

    save = async () => {
        try {
            const {showPositionOnMap, showPositionOnlyToContacts} = this.state;
            const confidentiality = {
                showPositionOnlyToContacts, showPositionOnMap
            };
            const result = await this.props.saveConfidentiality(this.user.id, confidentiality);
            if (result.error) {
                const errorText = i18nService.t(`validation_message.${result.message}`);
                messageService.showError(this.refs.flashMessage, errorText);
            } else {
                this.user.confidentiality = confidentiality;
                await userService.setUser(this.user);
                this.back();
            }
        } catch (e) {

        }

    };

    render() {
        const {
            isLoading,
            error
        } = this.props;

        const {showPositionOnMap, showPositionOnlyToContacts, changed} = this.state;
        return (
            <SafeAreaView style={{...sharedStyles.safeView}}>
                <View style={styles.mainView}>
                    <ListItem
                        containerStyle={styles.switchContainer}
                        titleStyle={styles.switchTitle}
                        title={i18nService.t('show_position_on_map')}
                        switch={{
                            onValueChange: this.handleShowPositionOnMapChange,
                            value: showPositionOnMap
                        }}
                    />
                    {
                        showPositionOnMap ? <ListItem
                            containerStyle={styles.switchContainer}
                            titleStyle={styles.switchTitle}
                            title={i18nService.t('show_position_only_to_friends')}
                            switch={{
                                onValueChange: this.handleShowPositionOnlyToContactsChange,
                                value: showPositionOnlyToContacts
                            }}
                        /> : null
                    }
                    {
                        changed ? <LargeButton type={'solid'}
                                               title={i18nService.t('save')}
                                               buttonStyle={{
                                                   marginTop: 40,
                                                   backgroundColor: colors.backgroundColor
                                               }}
                                               titleStyle={{
                                                   color: 'white'
                                               }}
                                               loading={isLoading}
                                               loadingProps={{color: 'white'}}
                                               onPress={async () => {
                                                   if (!isLoading) {
                                                       await this.save();
                                                   }
                                               }}
                        /> : null
                    }
                </View>
                <FlashMessage position="top" ref={'flashMessage'}/>
            </SafeAreaView>
        );
    }
}
