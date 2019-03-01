import React, {Component} from 'react';
import EntryPoint from './src/index'
import AppContainer from './src/routes/index'
import { Provider } from 'react-redux';
import { Store } from './src/store';

export default class App extends Component{
  render() {
    return (
      <Provider store={Store}>
        <AppContainer />
      </Provider>
    )
  }
}
