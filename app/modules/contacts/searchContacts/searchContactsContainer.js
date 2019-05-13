import { connect } from 'react-redux';
import SearchContactsView from './searchContactsView';
import { bindActionCreators } from 'redux';
import {
  searchContacts
} from './searchContactsState';

const mapStateToProps = state => ({
  data: state.contactsState.data,
  isLoading: state.contactsState.isLoading,
  error: state.contactsState.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  searchContacts
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchContactsView);
