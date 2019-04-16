
import { connect } from 'react-redux';
import WeatherView from './weatherView';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({
  weather: state.weather
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WeatherView);
