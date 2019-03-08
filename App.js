import React, {Component} from 'react';
import EntryPoint from './src/index'
import AppContainer from './src/routes/index'
import { Provider } from 'react-redux';
import { Store } from './src/store';
import * as firebase from 'firebase'
import { firebaseConfig } from './src/service/firebase'

export default class App extends Component{

  componentWillMount(){
    console.log('firebase config', firebaseConfig())
    firebase.initializeApp(firebaseConfig());
  }
  render() {
    return (
      <Provider store={Store}>
        <AppContainer />
      </Provider>
    )
  }
}
