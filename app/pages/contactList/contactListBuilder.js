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
import ModalCalendar from "../../components/modalCalendar";
import {showAlert} from '../../utils/RequestUtils';
import {CONTACT_LIST_BUILDER_ITEMS} from '../../constants/ContactListItems';
import {fetchContactBusinessType, handleUserInput, fetchContacCreate} from '../../actions/contactList'
import {CONTACT_TYPE_URL, CONTACT_CREAT_URL} from '../../constants/Network';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../../actions/timeConsuming';
import * as common from './common';

var HEIGHT = Dimensions.get('window').height;
var formView;

export default class ContactListBuilder extends React.Component{
  constructor(props) {
      super(props);
      this.onLeftBack = this.onLeftBack.bind(this);
      this.onCommit = this.onCommit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {contactListBase, dispatch} = nextProps;
    if(contactListBase.contactBusinessTypeFetched){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(contactListBase.error){
        showAlert(contactListBase.error);
      } else {
        let items = [];
        for(let item of contactListBase.contactBusinessTypeData){
          items.push(item.name)
        }
        CONTACT_LIST_BUILDER_ITEMS[0].items = items;
        let _this = this;
        formView = CONTACT_LIST_BUILDER_ITEMS.map(function(row) {
          return <FormItemsFilter {...nextProps} row={row} refs={_this.refs} onUserInput={(userInputKey, userInputValue) => {
            if(userInputKey === "type"){
              let newUserInputValue = {};
              for(let item of contactListBase.contactBusinessTypeData){
                if(item.name === userInputValue){
                  newUserInputValue.id = item.id;
                  break;
                }
              }
              nextProps.dispatch(handleUserInput(userInputKey, newUserInputValue, common.CONTACT_INUPT_TYPE_CREATE));
            } else if (userInputKey === "chargePerson") {
              let newUserInputValue = {};
              newUserInputValue.id = userInputValue;
              nextProps.dispatch(handleUserInput(userInputKey, newUserInputValue, common.CONTACT_INUPT_TYPE_CREATE));
              let createPerson = {};
              createPerson.id = nextProps.login.rawData.userId;
              nextProps.dispatch(handleUserInput('createPerson', createPerson, common.CONTACT_INUPT_TYPE_CREATE));
            } else {
              nextProps.dispatch(handleUserInput(userInputKey, userInputValue, common.CONTACT_INUPT_TYPE_CREATE));
            }
          }}/>
        });
      }
    }
    if(contactListBase.contactCreateCommitted){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(contactListBase.contactCreateResult === "success"){
        Alert.alert('', '提交成功!',[{text: '确定', onPress: () =>{}},]);
        nextProps.navigator.pop();
      }else if(contactListBase.contactCreateResult === 'failure'){
        Alert.alert('', '提交失败!', [{text: '确定'},]);
      }else if(contactListBase.error){
        showAlert(contactListBase.error);
      }
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchContactBusinessType(CONTACT_TYPE_URL));
    dispatch(startHandleTimeConsuming());
  }

  render() {
    const {contactListBase} = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title='创建' titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../../img/office/icon-backs.png')}
          rightButtonTitle={'提交'} rightButtonTitleColor={'#fff'}
          onRightButtonPress={this.onCommit}/>
        <ScrollView style={styles.formViewContainer}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={true}
          ref='keyboardView'
          keyboardDismissMode='interactive'>
            {formView}
        </ScrollView>
        <ModalCalendar ref={'modalcalendar'}/>
        <View>
          <Spinner visible={contactListBase.contactBusinessTypeFetching} text={'加载中,请稍后...'}/>
          <Spinner visible={contactListBase.contactCreateCommitting} text={'提交中,请稍后...'}/>
        </View>
      </View>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onCommit() {
    if(this.checkData()){
      const {dispatch, contactListBase} = this.props;
      dispatch(fetchContacCreate(CONTACT_CREAT_URL, contactListBase.contactListCreateInputData));
      dispatch(startHandleTimeConsuming());
    }
  }

  checkData(){
    const {contactListBase} = this.props;
    let json = eval('(' + contactListBase.contactListCreateInputData + ')');
    for(let item of CONTACT_LIST_BUILDER_ITEMS){
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
    flexDirection: 'column'
  },
});
