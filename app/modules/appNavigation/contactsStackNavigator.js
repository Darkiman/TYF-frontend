import {createStackNavigator} from "react-navigation";
import contactsContainer from "../contacts/contactsContainer";
import searchContactsContainer from "../contacts/searchContacts/searchContactsContainer";
import contactOptionsContainer from "../contacts/contactOptions/contactOptionsContainer";

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
    },
    ContactOptions: {
        screen: contactOptionsContainer,
        navigationOptions: () => ({
            header: null,
        })
    }
});

export default ContactsStackNavigator;


