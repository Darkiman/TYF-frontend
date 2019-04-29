import { connect } from 'react-redux';
import AuthView from './authView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthView);
