'use strict'

import React from 'react';
import {
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  InteractionManager
} from 'react-native';

import LineItem from  '../components/lineItem';
import Colors from '../constants/Colors';
import UserInfoContainer from '../containers/UserInfoContainer';
import ChangePasswordContainer from '../containers/ChangePasswordContainer';
import About from './about';
import {fetchAvatar} from '../actions/userInfo';
import JPush from 'react-native-jpush';
import {changeWebviewUrl} from '../actions/webview';
import {ME_HELP, ME_VERSION} from '../constants/Network';
import WebviewContainer from '../containers/WebviewContainer';
import {changeLoginAuth} from '../actions/login';
import global from '../utils/GlobalStorage';
import LoginContainer from '../containers/LoginContainer';

const top = Platform.OS === 'ios' ? 20 : 0;

export default class SettingTab extends React.Component {
  constructor(props){
    super(props);
    this.onUserInfo = this.onUserInfo.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onAbout = this.onAbout.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onVersion = this.onVersion.bind(this);
    this.onHelp = this.onHelp.bind(this);
    //props.dispatch(fetchAvatar(props.login.rawData.userId));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userInfo.avatarGot && !nextProps.userInfo.avatarData)
      Alert.alert('','个人信息获取失败!',[{text: '好', onPress: () =>{}},])
  }

  render() {
    const {login, userInfo} = this.props;
    return(
      <View style={styles.background}>
      <View style={styles.containers}>
        <TouchableOpacity style={{marginTop: top, }} onPress={this.onUserInfo}>
          <View style={styles.bgAvatar}>
            <Image style={styles.avatar} source={userInfo.avatarData ? userInfo.avatarData : require('../img/icon/icon-avatar.png')}/>
            <Text style={styles.userInfo}>{login.rawData.nickName}</Text>
            <Image style={styles.nextIcon} source={require('../img/icon/icon-next.png')}/>
          </View>
        </TouchableOpacity>
        <LineItem
          type='nextIcon' top='20' text='修改密码' onClick={this.onChangePassword}
          icon={require('../img/icon/icon-locks.png')} />
        <LineItem
          type='nextIcon' text='帮助' onClick={this.onHelp}
          icon={require('../img/icon/icon-help.png')} />
        <LineItem
          type='nextIcon' text='版本信息' onClick={this.onVersion}
          icon={require('../img/icon/icon-version.png')} />
        <LineItem top='40' type='text' text='注销' fontColor='#ED4D4D'
          fontSize='16' onClick={this.onLogout} />
      </View>
          <View style={styles.phone}>
            <Text style={styles.phoneText}>如有任何疑问，请拨打服务电话</Text>
            <TouchableOpacity  onPress={()=> this.callPhone()}>
              <View style={{flexDirection: 'row',}}>
              <Text style={styles.phoneNumber}>15102113061</Text>
              <Image style={{height:34, width:34,}} source={require('../img/icon/telephone.png')}/>
              </View>
            </TouchableOpacity>
            <Text style={styles.phoneText}>或者发送邮件至</Text>
            <Text style={styles.phoneNumber}>429718074@qq.com</Text>
          </View>
      </View>
    );
  }

  onUserInfo(){
    const {navigator} = this.props;
    navigator.push({
      name: "UserInfo",
      component: UserInfoContainer,
    });
  }

  onChangePassword(){
    const {navigator} = this.props;
    navigator.push({
      name: "ChangePassword",
      component: ChangePasswordContainer,
    });
  }

  onAbout () {
    const {navigator} = this.props;
    navigator.push({
      name: "About",
      component: About,
    });
  }

  onLogout(){
    console.log('退出登录');
    const {navigator, dispatch} = this.props;
    //JPush.setAlias('');
    JPush.clearAllNotifications();
    InteractionManager.runAfterInteractions(() => {
      global.storage.save({
         key: 'userName',  //注意:请不要在key中使用_下划线符号!
         rawData: {
         },
       });
       global.storage.save({
           key: 'gesture',
           rawData: {
               gesture: '',
           },
       });
      dispatch(changeLoginAuth({username: '', password: '', rawData: undefined}));
      navigator.resetTo({
        component: LoginContainer,
        name: 'Login'
      });
    });
  }

  onVersion(){
    const {navigator, dispatch} = this.props;
    dispatch(changeWebviewUrl(ME_VERSION));
    navigator.push({
      name: "WebviewContainer",
      component: WebviewContainer,
    });
  }

  callPhone(){
    var   url ;
    if(Platform.OS !== 'android') {
      url = 'telprompt:';
    }
    else {
      url = 'tel:';
    }
    Linking.openURL(url + '18521059559');
  }

  onHelp(){
    const {navigator, dispatch} = this.props;
    dispatch(changeWebviewUrl(ME_HELP));
    navigator.push({
      name: "WebviewContainer",
      component: WebviewContainer,
    });
  }
};
var styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  containers:{
    flex:3,
  },
  phoneText:{
    marginTop: 5,
    color: '#999',
    fontSize: 12,

  },
  phone:{
    flex: 1,
    alignItems: 'center',
  },
  bgAvatar:{
    flexDirection: 'row',
    height: 96,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  phoneNumber:{
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
  avatar: {
    width:80,
    height: 80,
    borderRadius: 40,
    marginLeft: 8,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  nextIcon: {
    width: 8,
    height: 14,
    marginRight: 8,
  },

});
