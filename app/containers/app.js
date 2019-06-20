import React from 'react';
import ReactNative from 'react-native';

const {
  StyleSheet,
  Navigator,
  StatusBar,
  BackAndroid,
  View,
  Dimensions,
  InteractionManager,
  AppState,
  Platform,
} = ReactNative;

import {connect} from 'react-redux';
import Splash from '../pages/splash';
import {NaviGoBack} from '../utils/CommonUtils';
import JPush, {JpushEventReceiveCustomMessage, JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush';
import TaskListContainer from '../containers/TaskListContainer';
import GesturePassword from '../pages/gesturePassword';
import {TASKLIST_URL} from '../constants/Network';

var _navigator, _route;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
var isPushNotice = false;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.goBack = this.goBack.bind(this);
    BackAndroid.addEventListener('hardwareBackPress', this.goBack);
  }

  componentDidMount() {
    //JPush.setAlias('');
    JPush.requestPermissions()
    this.pushlisteners = [
        JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage.bind(this)),
        JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage.bind(this)),
    ];
    JPush.setLatestNotificationNumber(1);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    this.pushlisteners.forEach(listener=> {
        JPush.removeEventListener(listener);
    });
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange() {
      if(AppState.currentState === 'active'){
        if(isPushNotice){
          isPushNotice = false;
          return;
        }
        if(_route.name != 'gesturePassword' && _route.name != 'Login' ){
          _navigator.push({
            name: 'gesturePassword',
            component: GesturePassword,
          });
        }
      }
  }

  goBack() {
    const {timeConsuming} = this.props;
    if (!timeConsuming.canGoBack || _route.name === 'gesturePassword') {
      return true;
    }
    return NaviGoBack(_navigator);
  }

  renderScene(route, navigator) {
    let Component = route.component;
    _navigator = navigator;
    _route = route;
    return (
      <Component navigator={navigator} route={route} />
    );
  }

  configureScene(route, routeStack) {
    return Navigator.SceneConfigs.FadeAndroid;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Navigator
          ref='navigator'
          style={styles.navigator}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          initialRoute={{
            component: Splash,
            name: 'Splash'
          }}/>
      </View>
    );
  }

  onReceiveMessage(message) {
  }

  onOpenMessage(message) {
    const {login} = this.props;
    if(login.rawData && login.rawData.userId && login.rawData.userId != '' && login.username && login.username!= ''){
      isPushNotice = true;
      JPush.clearAllNotifications();
      if(AppState.currentState == 'active'){
        if(_route.name === 'TaskListContainer'){
          _navigator.replaceAtIndex({
            name: "TaskListContainer",
            component: TaskListContainer,
            url: TASKLIST_URL,
            navBarTitle: "待办",}, 0);
        } else {
          InteractionManager.runAfterInteractions(() => {
            _navigator.push({
              name: "TaskListContainer",
              component: TaskListContainer,
              url: TASKLIST_URL,
              navBarTitle: "待办",
            });
          });
        }
      } else if (AppState.currentState == 'background'){
        _navigator.push({
          name: 'gesturePassword',
          component: GesturePassword,
          type: 'notice',
        });
      }
    }
  }
}

let styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
});

function mapStateToProps(state) {
  const {timeConsuming, login} = state;
  return {
    timeConsuming,
    login
  }
}

export default connect(mapStateToProps)(App);
