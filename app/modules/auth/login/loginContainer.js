import { connect } from 'react-redux';
import LoginView from './loginView';
import { bindActionCreators } from 'redux';
import {
    signup,
    login,
} from './loginState';

const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => bindActionCreators({
    login
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginView);
