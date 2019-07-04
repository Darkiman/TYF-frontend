import { connect } from 'react-redux';
import confidentiality from './confidentialityView';
import { bindActionCreators } from 'redux';
import {
  saveConfidentiality
} from "./confidentialityState";

const mapStateToProps = state => ({
  data: state.confidentiality.data,
  isLoading: state.confidentiality.isLoading,
  error: state.confidentiality.error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  saveConfidentiality
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(confidentiality);
