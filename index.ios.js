/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {AppRegistry, Component, StyleSheet, Navigator, Text, View, AppStateIOS, PushNotificationIOS} = React;
var LoginView = require('./js/views/LoginView');
var SignUpView = require('./js/views/SignupView');
var ChatListView = require('./js/views/ChatListView');
var LoadingView = require('./js/views/LoadingView');
var NewChatView = require('./js/views/NewChatView');
var ChatDetailView = require('./js/views/ChatDetailView');
var SettingsView = require('./js/views/SettingsView');
var SignupStepTwoView = require('./js/views/SignupStepTwoView');
var emitter = require('./js/classes/Emitter');
var Storage = require('./js/classes/Storage');

(route, routeStack) => Navigator.SceneConfigs.FloatFromRight

class reactNativeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: "Loading",
      appState: AppStateIOS.currentState,
      memoryWarnings: 0
    };
  }

  componentWillMount() {
    AppStateIOS.addEventListener('change', this._handleAppStateChange.bind(this));
    AppStateIOS.addEventListener('memoryWarning', this._handleMemoryWarning.bind(this));
    PushNotificationIOS.addEventListener('notification', this._onNotification);
    PushNotificationIOS.addEventListener('register', this._onRegsterNotification);
  }

  componentDidMount() {
    // TODO: make a dialog before requesting permissions
    PushNotificationIOS.requestPermissions();


  }

  componentWillUnmount() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange.bind(this));
    AppStateIOS.removeEventListener('memoryWarning', this._handleMemoryWarning).bind(this);
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
    PushNotificationIOS.removeEventListener('register', this._onRegsterNotification);
  }

  _onRegsterNotification(deviceTokenIOS) {
    console.log('_onRegsterNotification deviceToken=', deviceTokenIOS);
    // Save this token locally.
    Storage.setValueForKey('deviceTokenIOS', deviceTokenIOS);
  }

  _onNotification(notification) {
    emitter.emit('notification', notification);
  }

  _handleMemoryWarning() {
    this.setState({memoryWarnings: this.state.memoryWarnings + 1});
    console.log('reactNativeChat:memoryWarning', this.state.memoryWarnings);
  }

  _handleAppStateChange(appState) {
    this.setState({
      appState
    });
    if (appState == 'active') {
      // TODO: emit some event to notify all UI components to do something.
      emitter.emit('appBecomeActive');
      // TODO: reset the badge number after viewed the message
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    } else {
      emitter.emit('appGoToBackground');
    }
    console.log('reactNativeChat:AppStateChange', appState);
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute = {{
          name: 'Loading',
          //name: 'SignupStepTwo',
          index: 0
        }}
        renderScene = {this.navigatorRenderScene}
      />
    );
  }
  navigatorRenderScene(route, navigator) {
    switch (route.name) {
      case 'Loading':
        return (<LoadingView navigator={navigator} />);
      case 'Login':
        return (<LoginView navigator={navigator} />);
      case 'Signup':
        return (<SignUpView navigator={navigator} />);
      case 'SignupStepTwo':
        return (<SignupStepTwoView navigator={navigator} />);
      case 'ChatList':
        return (<ChatListView navigator={navigator} />);
      case 'NewChat':
        return (<NewChatView navigator={navigator} onBack={route.onBack} />);
      case 'ChatDetail':
        return (<ChatDetailView navigator={navigator} conversation={route.conversation} onBack={route.onBack} />);
      case 'Settings':
        return (<SettingsView navigator={navigator} onBack={route.onBack} />);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

AppRegistry.registerComponent('reactNativeChat', () => reactNativeChat);
