import {createStackNavigator} from "react-navigation";
import contactsContainer from "../contacts/contactsContainer";
import searchContactsContainer from "../contacts/searchContacts/searchContactsContainer";

const ContactsStackNavigator = createStackNavigator({
    Contacts: {
        screen: contactsContainer,
        navigationOptions: () => ({
            header: null,
        })
    },
    SearchContacts: {
        screen: searchContactsContainer,
        navigationOptions: () => ({
            header: null,
        })
    }
});

export default ContactsStackNavigator;
