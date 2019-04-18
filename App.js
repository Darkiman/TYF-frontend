import React, {Component} from 'react';
import { Provider } from 'react-redux';
import AppNavigation from './app/modules/appNavigation/appNavigation';

import configureStore from './app/store/configureStore';

const store = configureStore({});
export default class App extends Component {
  render() {
    return (
        <Provider store={store}>
            <AppNavigation/>
        </Provider>
    )
  }
}
