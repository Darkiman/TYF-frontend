import { connect } from 'react-redux';
import LoginView from './loginView';
import { bindActionCreators } from 'redux';
import {
    login,
} from './loginState';

const mapStateToProps = state => ({
    data: state.loginState.data,
    isLoading: state.loginState.isLoading,
    error: state.loginState.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
    login
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
