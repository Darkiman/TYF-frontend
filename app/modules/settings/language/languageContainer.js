import { connect } from 'react-redux';
import LanguageView from './languageView';
import { bindActionCreators } from 'redux';
import { changeLanguage } from './languageState';

const mapStateToProps = state => ({
  language: state.language
});

const mapDispatchToProps = dispatch => bindActionCreators({
    changeLanguage
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageView);
