import { connect } from 'react-redux';
import SignupView from './signupView';
import { bindActionCreators } from 'redux';
import {
    signup
} from './signupState';

const mapStateToProps = state => ({
    data: state.signupState.data,
    isLoading: state.signupState.isLoading,
    error: state.signupState.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
    signup
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupView);
