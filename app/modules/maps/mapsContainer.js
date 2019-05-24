import { connect } from 'react-redux';
import HomeView from './mapsView';
import { bindActionCreators } from 'redux';
import { getContactsPosition } from './mapsState';

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getContactsPosition
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeView);
