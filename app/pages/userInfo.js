'use strict'

import React from 'react';
import {
  Text,
  View,
  Navigator,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
  TextInput,
  Alert,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

import NavigationBar from '../components/ZqOfficeNavigationBar';
import Colors from '../constants/Colors';
import api from "../constants/Network";
var ImagePickerManager = require('NativeModules').ImagePickerManager;
import FileManager from 'react-native-fs';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import {fetchPhoneNumAndEmail, changeUserInfo, uploadAvatar, commitChangedUserInfo} from '../actions/userInfo';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import {changeLoginAuth} from '../actions/login';
import {showAlert} from '../utils/RequestUtils';

const ITEM_HEIGHT = Dimensions.get('window').height / 14;

export default class userInfo extends React.Component {
  constructor(props) {
    super(props);

    this.onLeftBack = this.onLeftBack.bind(this);
    this.onRightCommit = this.onRightCommit.bind(this);
    this.onAvatarPress = this.onAvatarPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {userInfo, login} = nextProps;
    if(userInfo.userInfoGot){
      nextProps.dispatch(stopHandleTimeConsuming());
    }

    if(userInfo.avatarUploaded ){
      nextProps.dispatch(stopHandleTimeConsuming());
      console.log(userInfo);
      Alert.alert('', userInfo.avatarResult, [{text: '好'}, ]);
    }

    if(userInfo.committed){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(userInfo.commitResult == "success"){
        Alert.alert('','个人信息修改成功!',[{text: '好', onPress: () =>{}},]);
        let data = login.rawData;
        data.email = userInfo.email;
        data.telephone = userInfo.phoneNumber;
        dispatch(changeLoginAuth({rawData: data}));
        nextProps.navigator.pop();
      }else if(userInfo.commitResult == 'failure'){
        Alert.alert('','个人信息修改失败!',[{text: '好'},]);
      }
    }

    if((userInfo.committed || userInfo.avatarUploaded || userInfo.userInfoGot)
      && userInfo.error){
        showAlert(userInfo.error);
      }
  }

  componentDidMount() {
    const {dispatch, login} = this.props;
    dispatch(fetchPhoneNumAndEmail(login.username));
    dispatch(startHandleTimeConsuming());
  }

  renderLoading () {
    if (Platform.OS == 'ios') {
      return;
    }
    else {
      return  (
          <Spinner visible={userInfo.avatarUploading} text={'头像上传中,请稍后...'}/>
      )}
    }

  render() {
    const {login, userInfo, dispatch} = this.props;
    const dismissKeyboard = require('dismissKeyboard');
    return(
      <View style={styles.background}>
        <NavigationBar
          title={'个人信息'} titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../img/office/icon-backs.png')}
          rightButtonIcon={{}}
          rightButtonTitle={'提交'}
          rightButtonTitleColor={'#fff'}
          onRightButtonPress={this.onRightCommit}/>
          {/*头像*/}
          <TouchableHighlight style={{marginTop: 20,}} onPress={this.onAvatarPress}>
            <View style={[styles.item,{justifyContent:'space-between',}]}>
              <Text style={styles.leftText}>头像</Text>
              <Image style={styles.avatar} source={userInfo.avatarData ? userInfo.avatarData : require('../img/icon/icon-avatar.png')}/>
            </View>
          </TouchableHighlight>

          <View style={{backgroundColor: Colors.mainBackground,height: 1,}}/>
          {/*姓名*/}
          <View style={[styles.item,{justifyContent:'space-between',}]}>
            <Text style={styles.leftText}>姓名</Text>
            <Text style={styles.rightText}>{login.rawData.nickName}</Text>
          </View>

          <View style={{backgroundColor: Colors.mainBackground,height: 1,}}/>
          {/*手机号码*/}
          <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
            <View style={[styles.item,{marginTop: 20,}]}>
              <Text style={styles.leftText}>手机号码</Text>
              <TextInput
                underlineColorAndroid={'transparent'}
                style={styles.textInput}
                defaultValue={userInfo.phoneNumber}
                onChangeText={(phoneNumber)=>dispatch(changeUserInfo({phoneNumber: phoneNumber}))}
                placeholder={'请输入您的手机号码'}/>
            </View>
          </TouchableWithoutFeedback>

          <View style={{backgroundColor: Colors.mainBackground, height: 1,}}/>

          {/*电子邮箱*/}
          <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
            <View style={styles.item}>
              <Text style={styles.leftText}>电子邮箱</Text>
              <TextInput
                underlineColorAndroid={'transparent'}
                style={styles.textInput}
                defaultValue={userInfo.email}
                onChangeText={(email)=>dispatch(changeUserInfo({email: email}))}
                placeholder={'请输入你的邮箱'}/>
            </View>
          </TouchableWithoutFeedback>

          <View>
            <Spinner visible={userInfo.userInfoGetting} text={'加载中,请稍后...'}/>
            {this.renderLoading()}
            <Spinner visible={userInfo.committing} text={'修改中,请稍后...'}/>
          </View>
      </View>
    );
  }

  onAvatarPress() {
    var options = {
      title: '选择头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册选取',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.2, //很重要，不设置会导致app很卡
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
        const source = {
          uri: response.uri,
          isStatic: true
        };
        const {dispatch, login} = this.props;
        dispatch(uploadAvatar(source, login.rawData.userId, login.username));
        dispatch(startHandleTimeConsuming());
      }
    });
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onRightCommit(){
    const {userInfo, login, dispatch} = this.props;
    let CheckEmail  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let CheckPhone =/^1[34578]\d{9}$/;
    if(userInfo.phoneNumber === '' && userInfo.email === '') {
      Alert.alert('提示','个人信息未修改！',[{text: '好'},]);
      return;
    }
    if (userInfo.phoneNumber !== '' && !CheckPhone.test(userInfo.phoneNumber)) {
      Alert.alert('提示','您的手机号码不正确!',[{text: '好'},]);
      return;
    }
    if (userInfo.email !== '' && !CheckEmail.test(userInfo.email)) {
      Alert.alert('提示','您的邮箱不正确!',[{text: '好'},]);
      return;
    }
    dispatch(commitChangedUserInfo(userInfo.phoneNumber, userInfo.email, login.username));
    dispatch(startHandleTimeConsuming());
  }
};

var styles = StyleSheet.create({
  background:{
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  item:{
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  avatar: {
    width:ITEM_HEIGHT*0.8,
    height: ITEM_HEIGHT*0.8,
    borderRadius: ITEM_HEIGHT*0.4,
    marginLeft: 10,
    marginRight: 10,
  },
  leftText:{
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: '#333333',
  },
  rightText:{
    marginRight: 10,
    fontSize: 14,
    color: '#333333',
  },
  textInput:{
    flex : 1,
    fontSize: 14,
    width: 100,
    color: '#333333',
  },
  edit: {
    width: ITEM_HEIGHT*0.7,
    height: ITEM_HEIGHT*0.7,
  }
});
