import React, {Component} from "react";
import {Icon} from 'react-native-elements';
import {ActivityIndicator, View, Image, TouchableOpacity} from 'react-native';
import iconsService from "../../utils/iconsService";
import IconsType from "../../constants/IconsType";
import {sharedStyles} from "../../shared/styles/sharedStyles";
import ContactItem from "../contacItem/contactItem";
import i18nService from "../../utils/i18n/i18nService";
import messageService from "../../utils/messageService";
import LinearGradient from "react-native-linear-gradient";
import {SwipeListView} from "react-native-swipe-list-view";

export default class ContactsList extends Component {
    constructor(props) {
        super(props);
        this.iconPrefix = iconsService.getIconPrefix();
    }

    render() {
        const {
            contacts,
            contactsToShow,
            addContact,
            deleteContact,
            flashMessage,
            user,
            disableLeftSwipe
        } = this.props;
        return (
            <SwipeListView
                useFlatList
                stopLeftSwipe={300}
                stopRightSwipe={-100}
                leftOpenValue={75}
                rightOpenValue={-90}
                disableRightSwipe={true}
                disableLeftSwipe={disableLeftSwipe}
                data={contactsToShow}
                renderItem={(data, rowMap) => {
                    const contact = data.item;
                    return <ContactItem key={contact.key}
                                        title={contact.data.name[0]}
                                        data={contact}
                                        addContact={addContact}
                                        contacts={contacts}
                                        user={user}>
                    </ContactItem>
                }}
                renderHiddenItem={(data, rowMap) => {
                    const contact = data.item;
                    const isInContacts = contacts && contacts.find && contacts.find(item => item.key === contact.key);
                    const loading = contact.data.loading;
                    const showDelete = isInContacts && !loading;
                    return <View style={{position: 'absolute', right: 0}}>
                        {loading ? <View style={sharedStyles.actionsContainer}>
                                 <ActivityIndicator></ActivityIndicator>
                             </View> : null
                        }
                        {
                            showDelete ? <TouchableOpacity
                                onPress={async () => {
                                    if (deleteContact) {
                                        contact.data.loading = true;
                                        this.forceUpdate();
                                        console.log(user.id, contact.key);
                                        const result = await deleteContact(user.id, contact.key);
                                        if (result.error) {
                                            contact.data.loading = false;
                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                            messageService.showError(flashMessage, errorText);
                                        } else {
                                            const index = contactsToShow.findIndex(item => item.key === contact.key);
                                            contactsToShow.splice(index, 1);
                                            console.log(index);
                                        }
                                        contact.data.loading = false;
                                        this.forceUpdate();
                                    }
                                }}>
                                <LinearGradient style={sharedStyles.actionsContainer}
                                                colors={[sharedStyles.deleteGradient.start, sharedStyles.deleteGradient.end]}>
                                    <Icon type={IconsType.Ionicon}
                                          name={`${this.iconPrefix}-trash`}
                                          size={30}
                                          color={'white'}
                                    />
                                </LinearGradient>
                            </TouchableOpacity> : null
                        }
                    </View>
                }}
            />
        );
    }
}
