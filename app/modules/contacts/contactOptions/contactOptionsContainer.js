import { connect } from 'react-redux';
import ContactOptionsView from './contactOptionsView';
import { bindActionCreators } from 'redux';
import {
  changeOptions
} from './contactOptionsState';

const mapStateToProps = state => ({
  data: state.contactsState.data,
  isLoading: state.contactsState.isLoading,
  error: state.contactsState.error,
  contacts: state.contactsState.contacts
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeOptions
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactOptionsView);
