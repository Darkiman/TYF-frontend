import { connect } from 'react-redux';
import AuthView from './authView';
import { bindActionCreators } from 'redux';
import {
    signup,
    login,
} from './authState';

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => bindActionCreators({
    signup,
    login
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthView);
