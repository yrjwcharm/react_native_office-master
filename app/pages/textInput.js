'use strict'

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import Colors from '../constants/Colors';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import NavigationBar from '../components/ZqOfficeNavigationBar';

import {fetchOtherApproval} from "../actions/taskApproval";
import {changeStaffRemark} from '../actions/staffList';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import {showAlert} from '../utils/RequestUtils';

const deviceHeight = Dimensions.get('window').height;

export default class TextInputPage extends React.Component {
  constructor(props) {
    super(props);

    this.onLeftBack = this.onLeftBack.bind(this);
    this.doNext = this.doNext.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {taskApproval, dispatch} = nextProps;
    if(taskApproval.otherCommitted){
      dispatch(stopHandleTimeConsuming());
      if(taskApproval.otherCommitResult == "success"){
        Alert.alert('','操作成功!',[{text: '确定', onPress: () =>{}},]);
        navigator.popToRoute(navigator.getCurrentRoutes()[2]);
      }else if(taskApproval.otherCommitResult == 'failure'){
        Alert.alert('','操作失败!',[{text: '确定'},]);
      }else if(taskApproval.error){
        showAlert(taskApproval.error);
      }
    }
  }

  render() {
    const {dispatch, staffList, taskApproval} = this.props;
    let rightButtonTitle = '';
    let staffData = staffList.staffData;
    for(let i = 0; i < staffData.length; i++){
      if(staffData[i].select){
        rightButtonTitle = '下一步';
        break;
      }
    }
    const dismissKeyboard = require('dismissKeyboard');
    return (
      <View style={styles.container}>
        <NavigationBar title={'备注'} titleColor={Colors.white}
          leftButtonIcon={require('../img/office/icon-backs.png')} rightButtonTitle='提交'
          rightButtonTitleColor={'#fff'} backgroundColor={Colors.mainColor}
          onLeftButtonPress={this.onLeftBack} onRightButtonPress={this.doNext}/>

        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
          <View style={styles.main}>
            <TextInput
              style={{textAlignVertical: 'top', fontSize:14, height: deviceHeight / 5,}}
              placeholder={'请输入备注信息'}
              underlineColorAndroid={'transparent'}
              multiline={true}
              numberOfLines={5}
              maxLength={100}
              onChangeText={(remark)=>dispatch(changeStaffRemark(remark))} />
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Spinner visible={taskApproval.otherCommitting} text={'提交中,请稍后...'}/>
        </View>
      </View>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  doNext() {
    const {dispatch, staffList, route} = this.props;
    Alert.alert('', `确认提交?`,[{text: '确定',onPress : ()=>{
      dispatch(startHandleTimeConsuming());
      dispatch(fetchOtherApproval(route.taskId, route.type, staffList.userId, staffList.remark));
    }}, {text: "取消"}],);
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackground
  },
  main: {
    marginTop: 16,
    marginLeft: 16,
    marginRight:16,
    height: deviceHeight / 5,
    backgroundColor: Colors.white,
    borderColor: Colors.lightgrey,
		borderWidth: 1,
  },
});
