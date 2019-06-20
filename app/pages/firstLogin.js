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
  ScrollView,
  DeviceEventEmitter,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import NavigationBar from '../components/ZqOfficeNavigationBar';
import Colors from '../constants/Colors';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import {changeLoginAuth} from '../actions/login';
import {firstLoginSet, fetchFirstLoginSet, changeKeyboardSpace} from '../actions/firstLogin';
import global from '../utils/GlobalStorage';
import {showAlert} from '../utils/RequestUtils';

export default class firstLogin extends React.Component {
  constructor(props){
    super(props);
    this.onRightCommit = this.onRightCommit.bind(this);
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    if (Platform.OS === 'ios') {
      dispatch(changeKeyboardSpace(0));
      //添加代理事件
      DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
      DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
    }
  }
  //页面移除代理
  componentWillUnmount () {
    if (Platform.OS === 'ios') {
  　 　DeviceEventEmitter.removeAllListeners('keyboardWillShow');
  　 　DeviceEventEmitter.removeAllListeners('keyboardWillHide');
    }
  }

  componentWillReceiveProps(nextProps){
    const {firstLogin} = nextProps;
    if (firstLogin.firstLoaded) {
      if (firstLogin.firstLoadedResult == 'success') {
        Alert.alert('','用户信息设置成功,请重新登陆!', [{text: '好', onPress: () => {
          global.storage.save({
             key: 'userName',  //注意:请不要在key中使用_下划线符号!
             rawData: {
             },
           });
          nextProps.dispatch(changeLoginAuth({password: ''}));
          nextProps.navigator.popToTop();}},]);
      } else if(firstLogin.firstLoadedResult == 'failure'){
        Alert.alert('', firstLogin.msg , [{text: '好'},]);
      } else if(firstLogin.error){
        showAlert(firstLogin.error);
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.firstLogin.keyboardSpace !== this.props.firstLogin.keyboardSpace;
  }

  //更新键盘位置
  updateKeyboardSpace (frames) {
    //获取键盘高度
    const keyboardSpace = frames.endCoordinates.height;
    const {dispatch} = this.props;
    dispatch(changeKeyboardSpace(keyboardSpace));
  }

  resetKeyboardSpace () {
    const {dispatch} = this.props;
    dispatch(changeKeyboardSpace(0));
  }

  render() {
    const {dispatch, firstLogin} = this.props;
    const dismissKeyboard = require('dismissKeyboard');
    return(
      <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
        <View style={styles.background}>
          <NavigationBar title={'欢迎登陆'} titleColor={Colors.white}
            backgroundColor={Colors.mainColor}
            rightButtonTitle={'确认'} rightButtonTitleColor={'#fff'}
            onRightButtonPress={this.onRightCommit} />
            <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={true}
            ref='keyboardView'
            keyboardDismissMode='interactive'
            contentInset={{bottom: firstLogin.keyboardSpace}}>
            <View style={{backgroundColor: Colors.mainBackground, height: 1,}}
            />
            {/*手机号码*/}
          <Text style={{marginTop: 10,}}>设置您的手机号码</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            selectTextOnFocus={true}
            style={[styles.item,{marginTop: 10,}]}
            onChangeText={(telephone) => dispatch(firstLoginSet({telephone:telephone,}))}
            placeholder={'请输入您的手机号码'}
          />
          <View style={{backgroundColor: Colors.mainBackground,height: 1,}}/>
          {/*电子邮箱*/}
          <Text style={{marginTop: 10,}}>设置您的电子邮箱</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            selectTextOnFocus={true}
            style={[styles.item, {marginTop: 10,}]}
            onChangeText={(email) => dispatch(firstLoginSet({email: email,}))}
            placeholder={'请输入您的邮箱'}
          />
          <Text style={{marginTop: 10,}}>修改登陆密码</Text>
          <TextInput
            secureTextEntry={true}
            clearButtonMode='while-editing'
            style={[styles.item, {marginTop: 20,}]}
            onChangeText={(newPassword) => dispatch(firstLoginSet({newPassword: newPassword,}))}
            placeholder={'新密码'}/>
          <View style={styles.line}/>
          <TextInput
            clearButtonMode='while-editing'
            secureTextEntry={true}
            style={styles.item}
            onChangeText={(confirmPassword) => dispatch(firstLoginSet({confirmPassword: confirmPassword,}))}
            placeholder={'确认密码'}/>
            <Text style={{marginTop: 10, color: Colors.mainColor, fontSize: 12}}>注:首次登陆,请完善个人信息并修改初始登陆密码</Text>
            </ScrollView>
            <View>
              <Spinner visible={firstLogin.firstLoading} text={'密码修改中,请稍后...'}/>
            </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

    onRightCommit() {
      const {login, firstLogin, dispatch} = this.props;
      let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,16}$/;
      let CheckEmail  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      let CheckPhone =/^1[34578]\d{9}$/;
      if (firstLogin.telephone === '' || !CheckPhone.test(firstLogin.telephone) ) {
          Alert.alert("",'您的手机号码不正确,请重新输入!',[{text: '确定', onPress: () =>{}},]);
      } else if (firstLogin.email === '' || !CheckEmail.test(firstLogin.email )) {
          Alert.alert("",'您的邮箱不正确,请重新输入!',[{text: '确定', onPress: () =>{}},]);
      } else if ( firstLogin.newPassword === '' || firstLogin.confirmPassword ==='') {
        Alert.alert("",'密码为空,请重新输入!',[{text: '确定', onPress: () =>{}},]);
      } else if (firstLogin.newPassword != firstLogin.confirmPassword){
        Alert.alert("",'新密码两次输入不一致!',[{text: '确定', onPress: () =>{}}]);
      } else if(!reg.test(firstLogin.newPassword)){
        Alert.alert("",'新密码必须为8-16位,且包含字母、数字和特殊字符!',[{text: '确定', onPress: () =>{}}]);
      } else{
        dispatch(fetchFirstLoginSet(login.username, login.password, firstLogin.newPassword, firstLogin.telephone, firstLogin.email,));
      }
    }
}

var styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  item: {
    height: 48,
    backgroundColor: Colors.white,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
  },
  textInput: {
    marginTop: 20,
    flex : 1,
    fontSize: 14,
    width: 100,
    height: 48,
    color: '#333333',
  },
});
