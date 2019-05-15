import {connect} from 'react-redux';
import ContactsView from './contactsView';
import {bindActionCreators} from 'redux';
import {
    getContacts,
    deleteContact,
    addContact
} from './contactsState';

const mapStateToProps = state => ({
    data: state.contactsState.data,
    isLoading: state.contactsState.isLoading,
    error: state.contactsState.error,
    contacts: state.contactsState.contacts
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getContacts,
    deleteContact,
    addContact
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ContactsView);
