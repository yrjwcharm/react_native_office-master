'use strict';

import React from 'react';
import {
  Dimensions,
  ListView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Colors from '../constants/Colors';
import PostCell from "../components/postCell/MessagePostCell";
import ToastAndroid from 'ToastAndroid';
import ViewPager from 'react-native-viewpager';
import LineItem from  '../components/lineItem';
import NoticeListContainer from '../containers/NoticeListContainer';
import AddressContainer from '../containers/AddressContainer';
import TaskListContainer from '../containers/TaskListContainer';
import MessageListContainer from '../containers/MessageListContainer';
import ContactListContainer from '../containers/ContactListContainer';
import WebviewContainer from '../containers/WebviewContainer';
import {TASKLIST_URL, TZDETIAL_URL} from '../constants/Network';
import {fetchNews, fetchTaskCount} from '../actions/tabIndex';
import {changeWebviewUrl} from '../actions/webview';
import {NOTICE_DETIAL_URL} from "../constants/Network";
import * as types from '../constants/NavigatorTypes';

const deviceWidth = Dimensions.get('window').width;
const top = Platform.OS === 'ios' ? 20 : 0;

export default class IndexTab extends React.Component {
  constructor(props) {
    super(props);
    this.onTodoPress = this.onTodoPress.bind(this);
    this.onNoticePress = this.onNoticePress.bind(this);
    this.onAddressList = this.onAddressList.bind(this);
    this.onMessageList = this.onMessageList.bind(this);
    this.onContactList = this.onContactList.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  componentDidMount() {
    const {dispatch, login, navigator} = this.props;
    this.didFocusSubscription = navigator.navigationContext.addListener('didfocus', (event) => {
      if(event.data.route && event.data.route.name == 'Main'){
        dispatch(fetchTaskCount(login.rawData.userId));
        dispatch(fetchNews());
      }
    });
    dispatch(fetchTaskCount(login.rawData.userId));
    dispatch(fetchNews());
  }

  componentWillUnmount() {
     this.didFocusSubscription.remove();
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.tabIndex.newsFetched || nextProps.tabIndex.countFetched;
  }

  renderPage(data: Object, pageID: number | string) {
    let id = data ? data.id : '';
    let path =  data ? data.path : '';
    return (
      <TouchableOpacity onPress={this.newsClick.bind(this, id)} style={styles.newsClick}>
      <Image
        source={{uri: path}}
        style={styles.page} >
      </Image>
      </TouchableOpacity>
    );
  }

  renderPostCell(post) {
    if (post.title == '待办'){
       return (<PostCell onSelect= {this.onTodoPress} post={post}/>);
    } else if(post.title == '通知公告'){
       return (<PostCell onSelect= {this.onNoticePress} post={post}/>);
    } else if(post.title == '通讯录'){
       return (<PostCell onSelect= {this.onAddressList} post={post}/>);
    } else if(post.title == '系统消息'){
       return (<PostCell onSelect= {this.onMessageList} post={post}/>);
    } else if(post.title == '工作联系单'){
       return (<PostCell onSelect= {this.onContactList} post={post}/>);
    } else {
       return (<PostCell post={post}/>);
    }
  }

  render() {
    const {tabIndex} = this.props;
    return (
      <View style={{flex : 1,}}>
        <View style={{height: 200, width: deviceWidth, marginTop: top}}>
          <ViewPager
            style={{backgroundColor: '#333'}}
            dataSource={tabIndex.newsData}
            renderPage={this.renderPage}
            isLoop={true}
            autoPlay={tabIndex.isAutoPlay}/>
        </View>
        <ListView
          dataSource={tabIndex.indexItemdata}
          renderRow={this.renderPostCell.bind(this)}
          style={styles.postsListView}/>
      </View>
    );
  }

  onAddressList(){
    const {navigator} = this.props;
    navigator.push({
      name: "AddressContainer",
      component: AddressContainer,
    });
  }

  onMessageList(){
    const {navigator} = this.props;
    navigator.push({
      name: "MessageListContainer",
      component: MessageListContainer,
    });
  }

  onNoticePress() {
    const {navigator} = this.props;
    navigator.push({
      name: "NoticeListContainer",
      component: NoticeListContainer,
    });
  }

  onTodoPress() {
    const {navigator} = this.props;
    navigator.push({
      name: "TaskListContainer",
      component: TaskListContainer,
      url: TASKLIST_URL,
      navBarTitle: "待办",
      type: types.TASK_LIST_NORMAL,
    });
  }

  onContactList() {
    const {navigator} = this.props;
    navigator.push({
      name: "ContactListContainer",
      component: ContactListContainer,
      type: types.CONTACT_LIST_BASE,
    });
  }

  newsClick(newID) {
    const {navigator, dispatch, login} = this.props;
    dispatch(changeWebviewUrl(NOTICE_DETIAL_URL + newID  + '&accountId=' + login.rawData.userId));
    navigator.push({
      name: "WebviewContainer",
      component: WebviewContainer,
    });
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBackground
  },
  loadingText: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    color: Colors.darkblue
  },
  postsListView: {
    backgroundColor: Colors.veryLightGrey
  },
  page: {
    flex: 1,
    width: deviceWidth,
 },
 newsClick:{
   flex: 1,
 },
});
