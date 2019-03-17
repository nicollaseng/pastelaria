import React, {Component} from 'react';
import EntryPoint from './src/index'
import AppContainer from './src/routes/index'
import { Provider } from 'react-redux';
import { Store }  from './src/store';
import * as firebase from 'firebase'
import { firebaseConfig } from './src/service/firebase'
import { ONE_SIGNAL_ID } from 'react-native-dotenv'
import OneSignal from 'react-native-onesignal'; // Import package from node modules

export default class App extends Component{

  constructor(properties) {
    super(properties);
    OneSignal.init(ONE_SIGNAL_ID);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillMount(){
    // avoid multiples firebase call
   !firebase.apps.length ? firebase.initializeApp(firebaseConfig()) : firebase.app();
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  render() {
    return (
      <Provider store={Store}>
        <AppContainer />
      </Provider>
    )
  }
}
