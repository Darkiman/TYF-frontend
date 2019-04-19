import { connect } from 'react-redux';
import SettingsView from './settingsView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  settings: state.settings
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsView);
