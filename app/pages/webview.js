'use strict';

import React from 'react';
import {
  WebView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import api from "../constants/Network";
import Colors from '../constants/Colors';
import NavigationBar from '../components/ZqOfficeNavigationBar';

export default class webview extends React.Component {
  constructor(props) {
    super(props);
    this.onLeftBack = this.onLeftBack.bind(this);
    this.showError = this.showError.bind(this);
    this.showState = this.showState.bind(this);
  }

  render() {
    const {webview} = this.props;
    return (
      <View style={{flex:1}}>
        <NavigationBar
          title={'详情'} titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../img/office/icon-backs.png')}/>
        <WebView
          scalesPageToFit={true}
          source={{uri: webview.webviewUrl}}
          renderError = {this.showError}
          onLoadStart={this.showState}
         />
      </View>
    );
  }

  showState() {
    return(
      <View>
        <Text style={{alignSelf:'center'}}>加载中...</Text>
      </View>
    )
  }

  showError() {
    return(
      <View>
        <Text style={{alignSelf:'center'}}>页面打开失败!</Text>
      </View>
    )
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }
};
