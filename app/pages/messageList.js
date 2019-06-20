'use strict'

import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Alert,
} from 'react-native';

import Colors from '../constants/Colors';
import NavigationBar from '../components/ZqOfficeNavigationBar';
import Spinner from '../lib/react-native-loading-spinner-overlay';
import iconMessage from '../img/icon/icon_message.png';

import {fetchMessageList} from '../actions/messageList'
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import {showAlert} from '../utils/RequestUtils';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.renderMessage = this.renderMessage.bind(this);
    this.onLeftBack = this.onLeftBack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {messageList} = nextProps;
    if(messageList.messageListFetched){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(messageList.error){
        showAlert(messageList.error);
      } else if (messageList.messageListData._cachedRowCount == 0) {
        Alert.alert('', '暂无消息通知！', [{text: '好'},]);
      }
    }
  }

  componentDidMount() {
    const {dispatch, login} = this.props;
    dispatch(fetchMessageList(login.rawData.userId));
    dispatch(startHandleTimeConsuming());
  }

  render() {
    const {messageList} = this.props;
    return(
      <View style={styles.container}>
        <NavigationBar
          title={'消息'} titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../img/office/icon-backs.png')}/>
        <ListView
          dataSource={messageList.messageListData}
          renderRow={this.renderMessage}
          style={styles.listView}/>
        <View>
          <Spinner visible={messageList.messageListFetching} text={'加载中,请稍后...'}/>
        </View>
      </View>
    )
  }

  renderMessage(message) {
    console.log('message = ', message);
    return(
      <View style={styles.messageContainer}>

        <View style={styles.titleContainer}>
          <View style={styles.title}>
            <Image source={iconMessage} style={styles.pic}/>
            <Text style={styles.titleText}>系统消息:</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{message.CREATE_DATE}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.content}>{message.MESSAGE}</Text>
        </View>

      </View>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }
}

var styles = StyleSheet.create({
  listView: {
    flex:1,
  },
  container: {
    flex:1,
    flexDirection: 'column',
    backgroundColor: "#f5f5f5",
  },
  messageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgrey,
    backgroundColor: Colors.white,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
  },
  titleText: {
    flex: 1,
    marginTop: 20,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    marginTop: 20,
    marginRight: 10,
    textAlign: 'right',
  },
  contentContainer: {
    flex: 1,
    margin: 10,
    marginLeft: 70,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    elevation: 2,
  },
  content: {
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    fontSize:14,
    color: Colors.black,
  },
  pic: {
    height:30,
    width:30,
    marginTop: 15,
    marginLeft: 10,
  },
});
