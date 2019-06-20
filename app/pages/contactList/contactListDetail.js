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
import {CONTACT_LIST_DETAIL_ITEMS} from '../../constants/ContactListItems';
import {fetchContactDetail} from '../../actions/contactList';
import {CONTACT_DETAIL_URL} from '../../constants/Network';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../../actions/timeConsuming';
import ContactListContainer from '../../containers/ContactListContainer';
import * as types from '../../constants/NavigatorTypes';
import * as common from './common';

var HEIGHT = Dimensions.get('window').height;
var formView;

export default class contactListDetail extends React.Component{
  constructor(props) {
      super(props);
      this.onLeftBack = this.onLeftBack.bind(this);
      this.onRightNext = this.onRightNext.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {contactListBase, dispatch, route} = nextProps;
    if(contactListBase.contactDetailFetched){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(contactListBase.error) {
        showAlert(contactListBase.error);
      } else {
        let data = contactListBase.contactDetailData[0];
        CONTACT_LIST_DETAIL_ITEMS[0].content = data.typeName;
        CONTACT_LIST_DETAIL_ITEMS[1].content = data.TITLE;
        CONTACT_LIST_DETAIL_ITEMS[2].content = data.leaderName;
        CONTACT_LIST_DETAIL_ITEMS[3].content = data.chargePerson;
        CONTACT_LIST_DETAIL_ITEMS[4].content = data.PLAN_DATE;
        CONTACT_LIST_DETAIL_ITEMS[5].content = data.taskStatus;
        CONTACT_LIST_DETAIL_ITEMS[6].content = data.TASK_DESCRIPTION;
        CONTACT_LIST_DETAIL_ITEMS[7].content = data.REPORT_DESCRIPTION;
        CONTACT_LIST_DETAIL_ITEMS[8].content = data.statusName;
        CONTACT_LIST_DETAIL_ITEMS[9].content = data.OPINION;
        formView = CONTACT_LIST_DETAIL_ITEMS.map(function(row) {
          return <FormItemsFilter {...nextProps} row={row}/>
        });
      }
    }
  }

  componentDidMount() {
    const {dispatch, route} = this.props;
    dispatch(fetchContactDetail(CONTACT_DETAIL_URL, route.contactListId));
    dispatch(startHandleTimeConsuming());
  }

  render() {
    const {contactListBase, route} = this.props;
    let rightButtonTitle;
    let type = route.peopleType;
    if(type === common.CONTACT_PERSON_TYPE_CREATE) {
      rightButtonTitle = '';
    } else if (type === common.CONTACT_PERSON_TYPE_CHARGE) {
      rightButtonTitle = '汇报';
    } else if (type === common.CONTACT_PERSON_TYPE_FOLLOW) {
      rightButtonTitle = '跟进';
    }
    return(
      <View style={styles.container}>
        <NavigationBar title='详情' titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../../img/office/icon-backs.png')}
          rightButtonTitle={rightButtonTitle} rightButtonTitleColor={'#fff'}
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
          <Spinner visible={contactListBase.contactDetailFetching} text={'提交中,请稍后...'}/>
        </View>
      </View>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onRightNext() {
    const {navigator, route, contactListBase} = this.props;
    navigator.push({
      name: "ContactListContainer",
      component: ContactListContainer,
      type: types.CONTACT_LIST_APPROVE,
      peopleType: route.peopleType,
      contactListId: route.contactListId,
      reportDescription: contactListBase.contactDetailData[0].REPORT_DESCRIPTION + "\r\n",
    });
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
