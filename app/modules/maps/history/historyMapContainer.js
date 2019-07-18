import { connect } from 'react-redux';
import HistoryMapView from './historyMapView';
import { bindActionCreators } from 'redux';
import { getContactHistory } from './historyMapState';

const mapStateToProps = state => ({
  data: state.historyMap.data,
  isLoading: state.historyMap.isLoading,
  error: state.historyMap.error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getContactHistory
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryMapView);
