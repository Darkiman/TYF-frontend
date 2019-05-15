import { connect } from 'react-redux';
import SearchContactsView from './searchContactsView';
import { bindActionCreators } from 'redux';
import {
  searchContacts
} from './searchContactsState';
import {
  deleteContact,
  addContact
} from './../contactsState';

const mapStateToProps = state => ({
  data: state.contactsState.data,
  isLoading: state.contactsState.isLoading,
  error: state.contactsState.error,
  contacts: state.contactsState.contacts
});

const mapDispatchToProps = dispatch => bindActionCreators({
  searchContacts,
  deleteContact,
  addContact
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchContactsView);
