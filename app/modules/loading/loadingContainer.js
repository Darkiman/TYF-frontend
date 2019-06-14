import { connect } from 'react-redux';
import LoadingView from './loadingView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingView);
