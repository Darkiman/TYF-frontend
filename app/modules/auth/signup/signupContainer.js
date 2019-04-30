import { connect } from 'react-redux';
import SignupView from './signupView';
import { bindActionCreators } from 'redux';
import {
    signup,
    login,
} from './signupState';

const mapStateToProps = state => ({
  signup: state.signup
});

const mapDispatchToProps = dispatch => bindActionCreators({
    signup
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupView);
