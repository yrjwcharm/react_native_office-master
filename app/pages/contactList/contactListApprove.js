'use strict';

import {
  StyleSheet,
  Text,
  Image,
  View,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';

import Colors from '../../constants/Colors';
import FormItemsFilter from '../../components/formComponent/FormItemsFilter';
import NavigationBar from '../../components/ZqOfficeNavigationBar';
import Spinner from '../../lib/react-native-loading-spinner-overlay';
import {showAlert} from '../../utils/RequestUtils';
import {CONTACT_LIST_FOLLOW_ITEMS, CONTACT_LIST_REPORT_ITEMS} from '../../constants/ContactListItems';
import {fetchContactFollowType, handleUserInput, fetchContacApprove} from '../../actions/contactList';
import {CONTACT_DETAIL_URL, CONTACT_TYPE_URL, CONTACT_FOLLOW_URL, CONTACT_REPORT_URL} from '../../constants/Network';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../../actions/timeConsuming';
import * as common from './common';

var HEIGHT = Dimensions.get('window').height;
var formView;

export default class contactListApprove extends React.Component{
  constructor(props) {
      super(props);
      this.onLeftBack = this.onLeftBack.bind(this);
      this.onRightNext = this.onRightNext.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {contactListBase, dispatch, route} = nextProps;
    if(contactListBase.contactFollowTypeFetched){
      dispatch(stopHandleTimeConsuming());
      if(contactListBase.error){
        showAlert(contactListBase.error);
      } else {
        let itemsFollowType = [];
        for(let item of contactListBase.contactFollowTypeData){
          itemsFollowType.push(item.name)
        }
        let itemsStatusType = [];
        for(let item of contactListBase.contactStatusTypeData){
          itemsStatusType.push(item.name)
        }
        CONTACT_LIST_FOLLOW_ITEMS[0].items = itemsStatusType;
        CONTACT_LIST_FOLLOW_ITEMS[1].items = itemsFollowType;
        formView = CONTACT_LIST_FOLLOW_ITEMS.map(function(row) {
          return <FormItemsFilter {...nextProps} row={row} onUserInput={(userInputKey, userInputValue) => {
            if(userInputKey === "taskStatus"){
              let newUserInputValue = {};
              for(let item of contactListBase.contactFollowTypeData){
                if(item.name === userInputValue){
                  newUserInputValue.id = item.id;
                  break;
                }
              }
              nextProps.dispatch(handleUserInput(userInputKey, newUserInputValue, common.CONTACT_INUPT_TYPE_FOLLOW));
              nextProps.dispatch(handleUserInput('id', route.contactListId, common.CONTACT_INUPT_TYPE_FOLLOW));
            } else if(userInputKey === "status"){
              let newUserInputValue = {};
              for(let item of contactListBase.contactStatusTypeData){
                if(item.name === userInputValue){
                  newUserInputValue.id = item.id;
                  break;
                }
              }
              nextProps.dispatch(handleUserInput(userInputKey, newUserInputValue, common.CONTACT_INUPT_TYPE_FOLLOW));
            } else {
              nextProps.dispatch(handleUserInput(userInputKey, userInputValue, common.CONTACT_INUPT_TYPE_FOLLOW));
            }
          }}/>
        });
      }
    }
    if(contactListBase.contactApproveCommitted){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(contactListBase.contactApproveResult === "success"){
        Alert.alert('', '提交成功!',[{text: '确定', onPress: () =>{}},]);
        nextProps.navigator.popToRoute(nextProps.navigator.getCurrentRoutes()[2]);
      }else if(contactListBase.contactApproveResult === 'failure'){
        Alert.alert('', '提交失败!', [{text: '确定'},]);
      }else if(contactListBase.error){
        showAlert(contactListBase.error);
      }
    }
  }

  componentWillMount() {
    const {route, dispatch} = this.props;
    if(route.peopleType === common.CONTACT_PERSON_TYPE_CHARGE) {
      let _this = this;
      formView = CONTACT_LIST_REPORT_ITEMS.map(function(row) {
        return <FormItemsFilter {..._this.props} row={row} onUserInput={(userInputKey, userInputValue) => {
          dispatch(handleUserInput(userInputKey, route.reportDescription + userInputValue, common.CONTACT_INUPT_TYPE_REPORT));
          dispatch(handleUserInput('id', route.contactListId, common.CONTACT_INUPT_TYPE_REPORT));
        }}/>
      });
    }
  }

  componentDidMount() {
    const {dispatch,route} = this.props;
    if(route.peopleType === common.CONTACT_PERSON_TYPE_FOLLOW) {
      dispatch(fetchContactFollowType(CONTACT_TYPE_URL));
      dispatch(startHandleTimeConsuming());
    }
  }

  render() {
    const {contactListBase, route} = this.props;
    let rightButtonTitle;
    let type = route.peopleType;
    if (type === common.CONTACT_PERSON_TYPE_CHARGE) {
      rightButtonTitle = '汇报';
    } else if (type === common.CONTACT_PERSON_TYPE_FOLLOW) {
      rightButtonTitle = '跟进';
    }
    return(
      <View style={styles.container}>
        <NavigationBar title={rightButtonTitle} titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../../img/office/icon-backs.png')}
          rightButtonTitle='提交' rightButtonTitleColor={'#fff'}
          onRightButtonPress={this.onRightNext}/>
        <ScrollView style={styles.formViewContainer}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={true}
          ref='keyboardView'
          keyboardDismissMode='interactive'>
            {formView}
        </ScrollView>
        <View>
          <Spinner visible={contactListBase.contactFollowTypeFetching} text={'加载中,请稍后...'}/>
          <Spinner visible={contactListBase.contactApproveCommitting} text={'提交中,请稍后...'}/>
        </View>
      </View>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onRightNext() {
    const {route, contactListBase} = this.props;
    let url, data, items, type = route.peopleType;
    if (type === common.CONTACT_PERSON_TYPE_CHARGE) {
      url = CONTACT_REPORT_URL;
      items = CONTACT_LIST_REPORT_ITEMS;
      data = contactListBase.contactListReportInputData;
    } else if (type === common.CONTACT_PERSON_TYPE_FOLLOW) {
      url = CONTACT_FOLLOW_URL;
      items = CONTACT_LIST_FOLLOW_ITEMS;
      data = contactListBase.contactListFollowInputData;
    }
    if(this.checkData(items, data)){
      const {dispatch, contactListBase} = this.props;
      dispatch(fetchContacApprove(url, data));
      dispatch(startHandleTimeConsuming());
    }
  }

  checkData(items, data){
    let json = eval('(' + data + ')');
    for(let item of items){
      if(item.required){
        if(!json[item.name] || json[item.name] == ''){
          Alert.alert('', `${item.title} 为必填项,请填写后再提交!`, [{text: '确定'},]);
          return false;
        }
      }
    }
    return true;
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  formViewContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
