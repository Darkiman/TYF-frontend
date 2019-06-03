import { connect } from 'react-redux';
import EditProfileView from './editProfileView';
import { bindActionCreators } from 'redux';
import {
  changeInfo,
} from './editProfileState';

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeInfo
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfileView);
