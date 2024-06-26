import { connect } from 'react-redux';
import HomeView from './homeView';
import { bindActionCreators } from 'redux';
import {
  saveConfidentiality,
} from './../settings/confidentiality/confidentialityState';

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
)(HomeView);
