import { connect } from 'react-redux';
import EditProfileView from './editProfileView';
import { bindActionCreators } from 'redux';
import {
  uploadAvatar,
} from './editProfileState';

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = dispatch => bindActionCreators({
  uploadAvatar
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfileView);
