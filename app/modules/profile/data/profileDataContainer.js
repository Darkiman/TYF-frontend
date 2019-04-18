import { connect } from 'react-redux';
import ProfileDataView from './profileDataView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  profileData: state.profileData
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileDataView);
