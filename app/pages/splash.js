'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  InteractionManager
} from 'react-native';

import Animated from 'Animated';
import global from '../utils/GlobalStorage';
import LoginContainer from '../containers/LoginContainer';
import MainContainer from '../containers/MainContainer';
import {changeLoginAuth} from '../actions/login';
import {connect} from 'react-redux';

var WINDOW_WIDTH = Dimensions.get('window').width;

class SplashScreen extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        bounceValue: new Animated.Value(1),
      };
  }

  componentDidMount() {
    const {navigator, dispatch} = this.props;
    setTimeout(() => {
      global.storage.load({
        key: 'userName',
      }).then((ret)=>{
        if (ret.userName && ret.password && ret.rawData){
          dispatch(changeLoginAuth({username: ret.userName, password: ret.password, rawData: ret.rawData}))
          navigator.push({
            name: "Main",
            component: MainContainer,
          });
        } else {
          InteractionManager.runAfterInteractions(() => {
            navigator.resetTo({
              component: LoginContainer,
              name: 'Login'
            });
          });
        }
      }).catch((err)=>{
        console.log('setAotoLogin error ==> ', err);
          InteractionManager.runAfterInteractions(() => {
            navigator.resetTo({
              component: LoginContainer,
              name: 'Login'
            });
          });
      })
    }, 2000);
  }

  render() {
    var img, text;
    img = require('../img/common/splash.jpg');
    text = '';

    return(
      <View style={styles.container}>
        <Animated.Image
          source={img}
          style={{
            flex: 1,
            width: WINDOW_WIDTH,
            height: 1,
            transform: [
              {scale: this.state.bounceValue},
            ]
          }}/>
        <Text style={styles.text}>
            {text}
        </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  cover: {
    flex: 1,
    width: 200,
    height: 1,
  },
  logo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    height: 54,
    backgroundColor: 'transparent',
  },
  text: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    backgroundColor: 'transparent',
  }
});

function mapStateToProps(state) {
  const {login} = state;
  return {
    login
  }
}

export default connect(mapStateToProps)(SplashScreen);
