import { connect } from 'react-redux';
import EditProfileView from './editProfileView';
import { bindActionCreators } from 'redux';
import {
  changeInfo,
} from './editProfileState';

const mapStateToProps = state => ({
  data: state.editProfile.data,
  isLoading: state.editProfile.isLoading,
  error: state.editProfile.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeInfo
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfileView);
