'use strict'
import {
  View,
  StyleSheet,
  ListView,
  TouchableOpacity,
  Text,
} from 'react-native';
import React from 'react';

import Colors from '../../constants/Colors';
import {CONTACT_LIST_URL} from '../../constants/Network';
import {fetchContactList} from '../../actions/contactList'
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../../actions/timeConsuming';
import ContactListContainer from '../../containers/ContactListContainer';
import LoadMoreFooter from '../../components/LoadMoreFooter';
import {showAlert} from '../../utils/RequestUtils';
import * as common from './common';
import * as types from '../../constants/NavigatorTypes';

var page;
var statusStyle;
var page = 1;
var canLoadMore = true;
var onEndReach = false;

export default class ContactListView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
    this.renderItem = this.renderItem.bind(this);
    this.onSelect = this.onSelect.bind(this);
    statusStyle = {
      color: 'black',
    };
    page = 0;
  }

  componentWillReceiveProps(nextProps) {
    const {contactListBase, dispatch} = nextProps;
    if(contactListBase.contactListFetched){
      canLoadMore = true;
      nextProps.dispatch(stopHandleTimeConsuming());
      if(contactListBase.error){
        showAlert(contactListBase.error);
      } else {
        statusStyle.color = nextProps.statusColor;
      }
    }
    //切换tab
    if(this.props.listType !== nextProps.listType){
      nextProps.onClear();
      page = 1;
      canLoadMore = false;
      onEndReach = false;
      dispatch(fetchContactList(CONTACT_LIST_URL, nextProps.login.rawData.userId, page, '', nextProps.listType));
      dispatch(startHandleTimeConsuming());
    }
    //搜索
    if(this.props.searchTitle !== nextProps.searchTitle){
      page = 1;
      canLoadMore = false;
      onEndReach = false;
      dispatch(fetchContactList(CONTACT_LIST_URL, nextProps.login.rawData.userId, page, nextProps.searchTitle, nextProps.listType));
      dispatch(startHandleTimeConsuming());
    }
  }

  componentDidMount() {
    const {dispatch, login, listType, navigator} = this.props;
    page = 1;
    canLoadMore = false;
    onEndReach = false;
    dispatch(fetchContactList(CONTACT_LIST_URL, login.rawData.userId, page, this.props.searchTitle, listType));
    dispatch(startHandleTimeConsuming());
    this.didFocusSubscription = navigator.navigationContext.addListener('willfocus', (event) => {
      if(event.data.route.type == types.CONTACT_LIST_BASE){
        page = 1;
        canLoadMore = false;
        onEndReach = false;
        dispatch(fetchContactList(CONTACT_LIST_URL, login.rawData.userId, page, this.props.searchTitle, listType));
        dispatch(startHandleTimeConsuming());
      }
    });
  }

  componentWillUnmount() {
    page = 1;
    this.didFocusSubscription.remove();
  }

  renderItem(rowData) {
    return (
      <TouchableOpacity onPress={this.onSelect.bind(this, rowData)}>
        <View style={styles.container}>
           <View style={styles.top}>
             <Text style={styles.title}>{rowData.TITLE}</Text>
             <Text style={[styles.status, {color: statusStyle.color}]}>{this.getStatus(rowData.PLAN_DATE, rowData.COMPLETE_DATE)}</Text>
           </View>
           <View style={styles.bottom}>
             <Text style={styles.name}>创建人: {rowData.DISPLAY_NAME}</Text>
             <Text style={styles.time}>计划完成日期: {this.getDate(rowData.PLAN_DATE)}</Text>
           </View>
          </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {contactListBase} = this.props;
    return(
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(contactListBase.contactListData)}
        renderRow={this.renderItem}
        style={styles.background}
        onScroll={this.onScroll}
        onEndReached={this.onEndReach.bind(this)}
        onEndReachedThreshold={10}
        renderFooter={this.renderFooter.bind(this)}
      />
    );
  }

  renderFooter() {
    const {contactListBase} = this.props;
    if (contactListBase.taskListFetchingMore) {
      return <LoadMoreFooter />
    }
  }

  // 上拉加载
  onEndReach() {
    const {dispatch, route, login, contactListBase} = this.props;
    if (canLoadMore && onEndReach) {
      if(contactListBase.taskListHasMore)
        page ++;
      dispatch(fetchContactList(CONTACT_LIST_URL, login.rawData.userId, page, this.props.searchTitle, listType));
      canLoadMore = false;
    }
  }

  onScroll() {
    if (!onEndReach)
      onEndReach = true;
  }

  onSelect(rowData) {
    const {navigator} = this.props;
    navigator.push({
      name: "ContactListContainer",
      component: ContactListContainer,
      type: types.CONTACT_LIST_DETAIL,
      contactListId: rowData.ID,
      peopleType: rowData.peopleType
    });
  }

  getDate(timeMilliseconds) {
    let date = new Date(timeMilliseconds);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    return Y + M + D;
  }

  getStatus(planTime, completeTime) {
    const {listType} = this.props;
    let text = '', date, day;
    switch(listType){
      case common.CONTACT_LIST_TYPE_PROGRESS:
        let currentDate = new Date;
        date = planTime - currentDate;
        day = Math.floor(date / (24 * 3600 * 1000))
        text = `新任务--剩余${day}天`;
        return text;
      case common.CONTACT_LIST_TYPE_COMPLETE:
        text = `完成于${this.getDate(completeTime)}`;
        return text;
      case common.CONTACT_LIST_TYPE_INCOMPLETE:
        date = completeTime - planTime;
        day = Math.floor(date / (24 * 3600 * 1000))
        text = `超时${day}天`;
        return text;
      case common.CONTACT_LIST_TYPE_OVERDUE:
        text = `完成于${this.getDate(completeTime)}`;
        return text;
      default:
        return text;
    }
  }

};

var styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
    height: 60,
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    textAlign: 'left',
  },
  status: {
    flex: 1,
    fontSize: 14,
    color: Colors.grey,
    textAlign: 'right',
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 11,
    color: Colors.grey,
    textAlign: 'left',
  },
  time: {
    flex: 1,
    fontSize: 11,
    color: Colors.grey,
    textAlign: 'right',
  }
});
