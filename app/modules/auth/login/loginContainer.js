import { connect } from 'react-redux';
import LoginView from './loginView';
import { bindActionCreators } from 'redux';
import {
    login,
} from './loginState';

const mapStateToProps = state => ({
    data: state.signupState.data,
    isLoading: state.signupState.isLoading,
    error: state.signupState.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
    login
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
