import { connect } from 'react-redux';
import ContactsView from './contactsView';
import { bindActionCreators } from 'redux';
import {
  getContacts
} from './contactsState';

const mapStateToProps = state => ({
  data: state.contactsState.data,
  isLoading: state.contactsState.isLoading,
  error: state.contactsState.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getContacts
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsView);
