'use strict'

import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import Colors from '../constants/Colors';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import NavigationBar from '../components/ZqOfficeNavigationBar';
import TextInputContainer from '../containers/TextInputContainer';

import {fetchStaffList, changeSearchName, assignStaffListData, assignStaffUserId} from '../actions/staffList';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import {showAlert} from '../utils/RequestUtils';
import * as types from '../constants/NavigatorTypes';

String.prototype.trim = function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

const deviceHeight = Dimensions.get('window').height;

export default class StaffList extends React.Component {
  constructor(props) {
    super(props);

    this.onLeftBack = this.onLeftBack.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.doNext = this.doNext.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {staffList, dispatch} = nextProps;
    if(staffList.staffListFetched){
      dispatch(stopHandleTimeConsuming());
      if(staffList.error){
        showAlert(staffList.error);
      }
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    let staffData = [];
    dispatch(assignStaffListData(staffData));
    dispatch(changeSearchName(''));
  }

  renderSelectArrow() {
    return(
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 30,}}>
        <Image style={{width: 20, height: 20}} source={require('../img/icon/icon-agree.png')}/>
      </View>
    )
  }

  renderItem(rowData) {
    return (
      <TouchableOpacity onPress={this.onSelect.bind(this, rowData)}>
        <View style={styles.card}>
          <View style={{flexDirection: 'row', flex: 9}}>
            <View style={styles.userInfo}>
              <Image style={styles.avatar} source={require('../img/icon/icon-avatar.png')}/>
              <Text style={styles.detailText}>{rowData.nickName}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailText}>部门:{rowData.dept}</Text>
              <Text style={styles.detailText}>公司:{rowData.companyName}</Text>
            </View>
          </View>
          {rowData.select && this.renderSelectArrow()}
        </View>
      </TouchableOpacity>
    );
  }

  renderListView() {
    const {staffList} = this.props;
    if(staffList.staffListData._cachedRowCount <= 0) {
      return (
        <View style={{height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../img/icon/app_panel_expression_icon.png')} style={{width: 120, height: 120,}}/>
          <Text style={{textAlign:'center', fontSize: 15, color: Colors.grey,}}>当前没有搜索结果～</Text>
        </View>
      )
    } else {
      return (
        <ListView
          dataSource={staffList.staffListData}
          renderRow={this.renderItem}
        />
      )
    }
  }

  render() {
    const {dispatch, route, staffList} = this.props;
    let rightButtonTitle = '';
    let staffData = staffList.staffData;
    for(let i = 0; i < staffData.length; i++) {
      if(staffData[i].select){
        if(route.type === types.STAFF_LIST_NORMAL) {
          rightButtonTitle = '下一步';
        } else if (route.type === types.STAFF_LIST_CONTACT) {
          rightButtonTitle = '完成';
        }
        break;
      }
    }
    const dismissKeyboard = require('dismissKeyboard');
    return (
      <View style={styles.container}>
        <NavigationBar title={'人员列表'} titleColor={Colors.white}
          leftButtonIcon={require('../img/office/icon-backs.png')} rightButtonTitle={rightButtonTitle}
          rightButtonTitleColor={'#fff'} backgroundColor={Colors.mainColor}
          onLeftButtonPress={this.onLeftBack} onRightButtonPress={this.doNext}/>
          <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
            <View style={{flexDirection: 'row', height: 56}}>
              <TextInput
                style={styles.input}
                placeholder='请输入姓名查找'
                onChangeText={(searchName)=>dispatch(changeSearchName(searchName))}
                returnKeyType={'search'}
                onSubmitEditing={this.onSearch} />
              <TouchableOpacity onPress={this.onSearch}
                style={styles.search}>
                <Text>搜索</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.main}>
          {this.renderListView()}
          </View>

          <View>
            <Spinner visible={staffList.staffListFetching} text={'搜索中,请稍后...'}/>
          </View>
      </View>
    );
  }

  onSearch() {
    const {dispatch, staffList} = this.props;
    if(!staffList.searchName.trim() || staffList.searchName.trim().length <= 0) {
      Alert.alert('错误提示:','搜索内容不能为空!',[{text: '好'},]);
      return;
    }
    dispatch(fetchStaffList(staffList.searchName));
    dispatch(startHandleTimeConsuming());
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  doNext() {
    const {navigator, route, staffList} = this.props;
    if(route.type === types.STAFF_LIST_NORMAL) {
      navigator.push({
        name: "TextInput",
        component: TextInputContainer,
        taskId: route.taskId,
        type: route.dealType,
      });
    } else if (route.type === types.STAFF_LIST_CONTACT) {
      route.onStaffSelect(staffList.nickName, staffList.userId);
      navigator.pop();
    }

  }

  onSelect(rowData) {
    const {navigator, staffList, dispatch} = this.props;
    let staffData = staffList.staffData;
    for(let i = 0; i < staffData.length; i++){
      if(staffData[i].select)
        staffData[i].select = false;
      if(rowData.id == staffData[i].id){
        staffData[i].select = true;
        dispatch(assignStaffUserId(staffData[i].id, staffData[i].nickName));
      }
    }
    dispatch(assignStaffListData(staffData));
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackground
  },

  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#ccc',
    margin: 8,
    elevation: 1,
    padding: 8,
  },
  userInfo: {
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    alignSelf: 'center',
  },
  detail: {
    flexDirection: 'column',
    alignSelf:'center',
    marginLeft: 30,
  },
  detailText: {
    marginTop:5,
    fontSize: 12,
    color: '#666',
  },
  input: {
    flex: 1,
    height:32,
    margin: 8,
    elevation: 3,
    borderRadius: 2,
    backgroundColor: 'white',
    fontSize: 14,
  },
  search: {
    height:32,
    width:64,
    margin: 8,
    elevation: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor
  },
});
