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

const styles = {
    actionsContainer: {
        width: 90,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    }
};

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
            user
        } = this.props;
        return (
            <SwipeListView
                useFlatList
                stopLeftSwipe={300}
                stopRightSwipe={-100}
                leftOpenValue={75}
                rightOpenValue={-90}
                disableRightSwipe={true}
                data={contactsToShow}
                renderItem={(data, rowMap) => {
                    const contact = data.item;
                    return <ContactItem key={contact.key}
                                        title={contact.data.name[0]}
                                        data={contact}>
                    </ContactItem>
                }}
                renderHiddenItem={(data, rowMap) => {
                    const contact = data.item;
                    const isInContacts = contacts && contacts.find(item => item.key === contact.key);
                    const loading = contact.data.loading;
                    const showDelete = isInContacts && !loading;
                    const showAdd = !isInContacts && !loading;
                    return <View style={{position: 'absolute', right: 0}}>
                        {
                            showAdd ? <View style={styles.actionsContainer}>
                                <Icon type={IconsType.Ionicon}
                                      name={`${this.iconPrefix}-add`}
                                      size={30}
                                      color={'rgb(144,154,165)'}
                                      onPress={async () => {
                                          if (addContact) {
                                              contact.data.loading = true;
                                              this.forceUpdate();
                                              const result = await addContact(user.id, contact.key);
                                              if (result.error) {
                                                  contact.data.loading = false;
                                                  const errorText = i18nService.t(`validation_message.${result.message}`);
                                                  messageService.showError(flashMessage, errorText);
                                              } else {
                                                  contact.data.loading = false;
                                              }
                                              this.forceUpdate();
                                          }
                                      }}
                                />
                            </View> : null
                        }
                        {loading ? <View style={styles.actionsContainer}>
                                 <ActivityIndicator></ActivityIndicator>
                             </View> : null
                        }
                        {
                            showDelete ? <TouchableOpacity
                                onPress={async () => {
                                    if (deleteContact) {
                                        contact.data.loading = true;
                                        this.forceUpdate();
                                        const result = await deleteContact(user.id, contact.key);
                                        if (result.error) {
                                            contact.data.loading = false;
                                            const errorText = i18nService.t(`validation_message.${result.message}`);
                                            messageService.showError(flashMessage, errorText);
                                        } else {
                                            contact.data.loading = false;
                                        }
                                        this.forceUpdate();
                                    }
                                }}>
                                <LinearGradient style={styles.actionsContainer}
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
