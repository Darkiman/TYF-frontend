import { connect } from 'react-redux';
import LanguageView from './languageView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  language: state.language
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageView);
