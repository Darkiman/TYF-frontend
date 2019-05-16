import { connect } from 'react-redux';
import RecoverView from './recoverView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecoverView);
