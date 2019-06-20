'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
  Platform,
} from 'react-native';

import Colors from '../constants/Colors';
import NavigationBar from '../components/ZqOfficeNavigationBar';
import FormItemsFilter from '../components/formComponent/FormItemsFilter';
import SelectItem from "../components/selectItem";
import ModalCalendar from "../components/modalCalendar";
import DatePicker from "../components/datePicker";
import FilePicker from "../components/filePicker";
import readTable from './readTable';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import {fetchTaskApproval, changeKeyboardSpace, handleUserInput,
  fetchCommitApproval, fetchApprovalButton, fetchOtherApproval} from "../actions/taskApproval";
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import StaffListContainer from '../containers/StaffListContainer';
import {showAlert} from '../utils/RequestUtils';
import JPush from 'react-native-jpush';
import * as types from '../constants/NavigatorTypes';

//验证输入信息是否完整
var mustToInputItems = {};
var inputItems= [];
var formView = <View/>;
var tableView = <View/>;
var buttonView = <View/>;

export default class TaskApproval extends React.Component {
  constructor(props) {
    super(props);
    this.onLeftBack = this.onLeftBack.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {taskApproval, dispatch, navigator, route} = nextProps;
    //获取审批页面表单详情
    if(taskApproval.formFetched){
      dispatch(stopHandleTimeConsuming());
      if(taskApproval.error){
        showAlert(taskApproval.error);
      } else {
          if(!taskApproval.formData)
            return;
          let _refs = this.refs;
          let _this = this;
          for (var i = 0; i < taskApproval.formData.content.length; i++) {
            var item = taskApproval.formData.content[i];
              if ((!item.required) && (!item.readOnly)) {
                mustToInputItems[item.name] = item.title;
            }
          }
          formView = taskApproval.formData.content.map(function(row) {
            return <FormItemsFilter {..._this.props} row={row} refs={_refs} onUserInput={(userInputKey, userInputValue) => {
                dispatch(handleUserInput(userInputKey, userInputValue))
                if (inputItems.indexOf(userInputKey) === -1) {
                  inputItems.push(userInputKey);
                }
              }}/>
          });
          tableView = taskApproval.formData.listctrlVoList.map((rowData)=>{
            return (
              <View style={{backgroundColor:'white',height:50,}}>
                <TouchableOpacity onPress={() => {
                  navigator.push({
                    name: "ReadTable",
                    component: readTable,
                    tableData: rowData,
                  });
                  }}>
                  <Text style={{alignSelf:'center',marginTop:20,marginBottom:20,color:'#36a9e1',fontSize:16,}}>{rowData.code}>></Text>
                </TouchableOpacity>
              </View>
            );
          });
          dispatch(startHandleTimeConsuming());
          dispatch(fetchApprovalButton(route.taskId));
      }
    }
    //获取额外审批按钮列表
    if(taskApproval.buttonFetched){
      dispatch(stopHandleTimeConsuming());
      if(taskApproval.error){
        showAlert(taskApproval.error);
      } else {
        buttonView = taskApproval.buttonData.map((buttonData)=>{
          if(buttonData.name == 'completeTask')
            return;
          return (
            <ActionButton.Item buttonColor={buttonData.color} title={buttonData.label} buttonTextColor={Colors.white}
              titleBgColor={buttonData.color} onPress={this.onDealWith.bind(this, buttonData.type, buttonData.label)}>
              <Icon name="ios-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          );
        });
      }
    }
    //获取审批结果
    if(taskApproval.approvalCommitted){
      dispatch(stopHandleTimeConsuming());
      if(taskApproval.commitResult == "success"){
        Alert.alert('','审批成功!',[{text: '确定', onPress: () =>{}},]);
        JPush.changeBadgerNumber(1);
        nextProps.navigator.popToRoute(nextProps.navigator.getCurrentRoutes()[2]);
      }else if(taskApproval.commitResult == 'failure'){
        Alert.alert('','审批失败!',[{text: '确定'},]);
      }else if(taskApproval.error){
        showAlert(taskApproval.error);
      }
    }
    //获取额外流程处理结果（转办、协办）
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

  componentDidMount() {
    const {dispatch, route} = this.props;
    dispatch(fetchTaskApproval(route.taskId));
    dispatch(startHandleTimeConsuming());
    if (Platform.OS === 'ios') {
      dispatch(changeKeyboardSpace(0));
      //添加代理事件
      DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
      DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    const {taskApproval} = nextProps;
    return taskApproval.formFetched || taskApproval.formFetching
    || taskApproval.approvalCommitted || taskApproval.approvalCommitting
    || taskApproval.buttonFetched || taskApproval.buttonFetching
    || taskApproval.otherCommitted || taskApproval.otherCommitting
    ||  taskApproval.keyboardSpace !== this.props.taskApproval.keyboardSpace;
  }
  //页面移除代理
  componentWillUnmount () {
    if (Platform.OS === 'ios') {
      DeviceEventEmitter.removeAllListeners('keyboardWillShow');
      DeviceEventEmitter.removeAllListeners('keyboardWillHide');
    }
    formView = <View/>;
    tableView = <View/>;
    mustToInputItems = {};
    inputItems= [];
  }
  //更新键盘位置
  updateKeyboardSpace (frames) {
    const {dispatch} = this.props;
    dispatch(changeKeyboardSpace(frames.endCoordinates.height));
  }

  resetKeyboardSpace () {
    const {dispatch} = this.props;
    dispatch(changeKeyboardSpace(0));
  }

   judgeAllMustItems(){
     for (var item in mustToInputItems) {
       if (inputItems.indexOf(item) === -1) {
         Alert.alert('', mustToInputItems[item]+'未填写', [ {text: '确定', onPress: () =>{}}]);
         return false;
       }
     }
     return true;
   }

  render() {
    const {taskApproval} = this.props;
    return (
      <View style={styles.container}>
      <NavigationBar
        title='审批' titleColor={Colors.white}
        backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
        leftButtonIcon={require('../img/office/icon-backs.png')}
        rightButtonTitle={'提交'} rightButtonTitleColor={'#fff'}
        onRightButtonPress={this.onCommit}/>

        <ScrollView style={styles.formViewContainer}
          ref='keyboardView'
          keyboardDismissMode='interactive'
          automaticallyAdjustContentInsets={false}
          contentInset={{bottom: taskApproval.keyboardSpace}}>
          <View>
            {formView}
            {tableView}
          </View>
        </ScrollView>
        <ModalCalendar ref={'modalcalendar'}/>
        <DatePicker ref={'datapicker'}/>
        <SelectItem ref={'selectItem'}/>
        <FilePicker ref={'filePicker'}/>
        <View>
          <Spinner visible={taskApproval.formFetching} text={'加载中,请稍后...'}/>
          <Spinner visible={taskApproval.buttonFetching} text={'加载中,请稍后...'}/>
          <Spinner visible={taskApproval.approvalCommitting} text={'提交中,请稍后...'}/>
          <Spinner visible={taskApproval.otherCommitting} text={'提交中,请稍后...'}/>
        </View>
        <ActionButton buttonColor={Colors.mainColor}>
          {buttonView}
        </ActionButton>
      </View>
    );
  }

  onDealWith(dealType, label) {
    const {navigator, route, dispatch} = this.props;
    //退回、转信息办
    if(dealType == '3' || dealType == '4') {
      Alert.alert('', `确认要 ${label}?`,[{text: '确定',onPress : ()=>{
        dispatch(startHandleTimeConsuming());
        dispatch(fetchOtherApproval(route.taskId, dealType));
      }}, {text: "取消"}],);
    //转办、协办
    } else if(dealType == '1' || dealType == '2') {
      navigator.push({
        name: "StaffList",
        component: StaffListContainer,
        taskId: route.taskId,
        dealType: dealType,
        type: types.STAFF_LIST_NORMAL,
      });
    }
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onCommit() {
    const {taskApproval, route, dispatch, login} = this.props;
    let jsonData = taskApproval.approvalInputData;
    if(!jsonData || jsonData === '' || jsonData === '{}' || !taskApproval.formData) {
      Alert.alert('', '内容为空，无法提交!',[{text: '确定',onPress : ()=>{}}]);
      return;
    }
    // if(!this.judgeAllMustItems())
    //   return;
    dispatch(startHandleTimeConsuming());
    dispatch(fetchCommitApproval(taskApproval.approvalInputData, taskApproval.tableData,
      login.rawData.userId, route.taskId));
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 100,
    backgroundColor: Colors.mainBackground
  },
  formViewContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  calendarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  button: {
    height: 34,
    flexDirection: 'row',
    backgroundColor: Colors.mainColor,
    justifyContent: 'center',
    borderRadius: 8,
    margin: 5,
    marginLeft: 30,
    marginRight: 30
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    color: Colors.white
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
