import { connect } from 'react-redux';
import ContactOptionsView from './contactOptionsView';
import { bindActionCreators } from 'redux';
import {
  saveContactOptions
} from './contactOptionsState';

const mapStateToProps = state => ({
  data: state.contactOptionsState.data,
  isLoading: state.contactOptionsState.isLoading,
  error: state.contactOptionsState.error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  saveContactOptions
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactOptionsView);
