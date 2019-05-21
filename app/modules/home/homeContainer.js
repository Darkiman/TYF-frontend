import { connect } from 'react-redux';
import HomeView from './homeView';
import { bindActionCreators } from 'redux';
import {
  uploadAvatar,
} from './homeState';

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = dispatch => bindActionCreators({
  uploadAvatar
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeView);
