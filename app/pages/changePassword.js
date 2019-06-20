'use strict'

import React from 'react';
import {
  Text,
  View,
  Navigator,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import NavigationBar from '../components/ZqOfficeNavigationBar';
import Colors from '../constants/Colors';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import {changeUserPassword, fetchChangePassword} from '../actions/changePassword';
import {changeLoginAuth} from '../actions/login';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import global from '../utils/GlobalStorage';
import {showAlert} from '../utils/RequestUtils';

export default class changePassword extends React.Component {
  constructor(props){
    super(props);
    this.onLeftBack = this.onLeftBack.bind(this);
    this.onRightCommit = this.onRightCommit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {changePassword} = nextProps;
    if(changePassword.passwordChanged){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(changePassword.changeResult == "success"){
        Alert.alert('','密码修改成功,请重新登陆!', [{text: '好', onPress: () => {
          global.storage.save({
             key: 'userName',  //注意:请不要在key中使用_下划线符号!
             rawData: {
             },
           });
          nextProps.dispatch(changeLoginAuth({password: ''}));
          nextProps.navigator.popToTop();}},]);
      }else if(changePassword.changeResult == 'failure'){
        Alert.alert('',changePassword.msg , [{text: '好'},]);
      }else if(changePassword.error){
        showAlert(changePassword.error);
      }
    }
  }

  render() {
    const {dispatch, changePassword} = this.props;
    const dismissKeyboard = require('dismissKeyboard');
    return(
      <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
        <View style={styles.background}>
          <NavigationBar title={'修改密码'} titleColor={Colors.white}
            backgroundColor={Colors.mainColor}
            leftButtonIcon={require('../img/office/icon-backs.png')}
            onLeftButtonPress={this.onLeftBack}
            rightButtonTitle={'确认'} rightButtonTitleColor={'#fff'}
            onRightButtonPress={this.onRightCommit} />

          <TextInput
            secureTextEntry={true}
            clearButtonMode='while-editing'
            style={[styles.item,{marginTop:20,}]}
            onChangeText={(oldPassword) => dispatch(changeUserPassword({oldPassword: oldPassword}))}
            placeholder={'旧密码'}/>

          <TextInput
            secureTextEntry={true}
            clearButtonMode='while-editing'
            style={[styles.item,{marginTop:20,}]}
            onChangeText={(newPassword) => dispatch(changeUserPassword({newPassword: newPassword}))}
            placeholder={'新密码'}/>

          <View style={styles.line}/>

          <TextInput
            clearButtonMode='while-editing'
            secureTextEntry={true}
            style={styles.item}
            onChangeText={(confirmPassword) => dispatch(changeUserPassword({confirmPassword: confirmPassword}))}
            placeholder={'确认密码'}/>
          <View>
            <Spinner visible={changePassword.passwordChanging} text={'密码修改中,请稍后...'}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onRightCommit() {
    const {login, changePassword} = this.props;
    let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,16}$/;
    if(changePassword.oldPassword === '' || changePassword.newPassword === '' || changePassword.confirmPassword === ''){
        Alert.alert("",'密码为空,请重新输入!',[{text: '确定', onPress: () =>{}},]);
    }else if (changePassword.newPassword == changePassword.oldPassword){
      Alert.alert("",'新旧密码一致!',[{text: '确定', onPress: () =>{}}]);
    }else if (changePassword.newPassword != changePassword.confirmPassword){
      Alert.alert("",'新密码两次输入不一致!',[{text: '确定', onPress: () =>{}}]);
    }else if(!reg.test(changePassword.newPassword)){
      Alert.alert("",'新密码必须为8-16位,且包含字母、数字和特殊字符!',[{text: '确定', onPress: () =>{}}]);
    }else{
      const {dispatch} = this.props;
      dispatch(fetchChangePassword(login.username, changePassword.oldPassword, changePassword.newPassword));
      dispatch(startHandleTimeConsuming());
    }
  }

};

var styles = StyleSheet.create({
  background:{
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  item:{
    height: 48,
    backgroundColor: Colors.white,
  },
  line:{
    height: 1,
    backgroundColor: '#ccc',
  }
});
