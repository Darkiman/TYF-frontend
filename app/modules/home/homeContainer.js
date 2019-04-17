import { connect } from 'react-redux';
import HomeView from './homeView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  home: state.home
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeView);
