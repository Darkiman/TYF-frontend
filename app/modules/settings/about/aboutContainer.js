import { connect } from 'react-redux';
import AboutView from './aboutView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  about: state.about
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutView);
