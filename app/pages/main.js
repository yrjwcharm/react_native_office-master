'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
  Alert,
  Linking,
  InteractionManager,
} from 'react-native';

import ZqOfficeTabBar from '../components/ZqOfficeTabBar';
import Index from './tabIndex';
import Setting from './tabSetting';
import Office from './tabOffice';
import {GET_NEWVERSION_URL} from "../constants/Network";
import DeviceInfo from 'react-native-device-info';
import VersionCheck from '../utils/updateManager';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import GesturePassword from './gesturePassword';

var HEIGHT = Dimensions.get('window').height;

export default class MainScreen extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        page: 'message',
        loading: false,
      };
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  componentDidMount(){
    const {route, navigator} = this.props;
    this.didFocusSubscription = navigator.navigationContext.addListener('willfocus', (event) => {
    if (event.data && event.data.route && event.data.route.name == 'Main') {
      if ( Platform.OS === 'ios') {
        this.checkVersion();
      } else if ( Platform.OS === 'android'){
        if(!this.state.loading){
          VersionCheck.startCheck((result) => {
            Alert.alert('发现更新', '点击前往下载', [{text: '确定', onPress: () =>{
              VersionCheck.startUpdate((download) => {
                if(!download){
                  this.setState({
                    loading: false,
                  });
                  Alert.alert('更新失败', '网络异常', [{text: '确定', onPress: () =>{}}]);
                }
              });
              this.setState({
                loading: true,
              });
            }}]);
          });
        }
      }
    }
    });
    if ( Platform.OS === 'ios') {
      this.checkVersion();
    } else if ( Platform.OS === 'android'){
      if(!this.state.loading){
        VersionCheck.startCheck((result) => {
          Alert.alert('发现更新', '点击前往下载', [{text: '确定', onPress: () =>{
            VersionCheck.startUpdate((download) => {
              if(!download){
                this.setState({
                  loading: false,
                });
                Alert.alert('更新失败', '网络异常', [{text: '确定', onPress: () =>{}}]);
              }
            });
            this.setState({
              loading: true,
            });
          }}]);
        });
      }
    }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
      navigator.push({
          name: 'gesturePassword',
          component: GesturePassword,
        });
      });
    }, 1);
  }

  checkVersion(){
      //  getVersion_URL ='http://10.9.0.182:8080/bpm/task/findLatestVersionByPlatform.do?platform=ios';
      var getVersion_URL = GET_NEWVERSION_URL + '1';
      fetch(getVersion_URL)
      .then((response)=>response.json())
      .then((responseData)=>{
        if (DeviceInfo.getVersion() != responseData.infos.appInfo.version && DeviceInfo.getVersion() < responseData.infos.appInfo.version){
            Alert.alert('新版本!',responseData.infos.appInfo.info, [{text: '立即更新',
              onPress: () =>{Linking.openURL(responseData.infos.appInfo.appDownloadUrl);}}])
        }else{
          console.log('最新版本!!!');
        }
      })
      .catch((error)=>{
        console.log('checkVersion error',error);
      })
      .done()
    }

  renderPage(){
    if(this.state.page === 'message'){
      return (
        <Index {...this.props}/>
      );
    }else if(this.state.page === 'office'){
      return (
        <Office {...this.props}/>
      );
    }else if(this.state.page === 'setting'){
      return (
        <Setting {...this.props}/>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainPage}>
          {this.renderPage()}
        </View>
      <ZqOfficeTabBar selected={this.state.page} style={{backgroundColor:'#322a33', bottom:0,}}
        onSelect={el=>this.setState({page:el.props.name})}>
          <Image
            name='message' selectedStyle={{tintColor: '#ef6c00'}}
            style={{width:22,height: 34,}}
            selectedIconStyle={{borderTopWidth:2,borderTopColor:'#ef6c00'}}
            source={require('../img/icon/icon-home-active.png')} />
          <Image
            name='office' selectedStyle={{tintColor: '#ef6c00'}}
            style={{width:22,height: 34,}}
            selectedIconStyle={{borderTopWidth:2,borderTopColor:'#ef6c00'}}
            source={require('../img/icon/icon-office-active.png')} />
          <Image
            name='setting' selectedStyle={{tintColor: '#ef6c00'}}
            style={{width:22,height: 34,paddingTop: 2,}}
            selectedIconStyle={{borderTopWidth:2,borderTopColor:'#ef6c00'}}
            source={require('../img/icon/icon-setting-active.png')} />
      </ZqOfficeTabBar >
      <View>
        <Spinner visible={this.state.loading} text={'更新中,请稍后...'}/>
      </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainPage: {
    height: Platform.OS === 'ios'? HEIGHT-50 : HEIGHT-75,
  }
});
