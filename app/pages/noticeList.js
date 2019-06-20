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
import WebviewContainer from '../containers/WebviewContainer';
import Spinner from '../lib/react-native-loading-spinner-overlay';

import iconNext from '../img/icon/icon-next.png';
import iconTZ from '../img/icon/icon-TZ.png';

import {changeWebviewUrl} from '../actions/webview';
import {fetchNoticeList} from '../actions/noticeList'
import {NOTICE_URL, NOTICE_DETIAL_URL} from '../constants/Network';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import {showAlert} from '../utils/RequestUtils';


export default class NoticeList extends React.Component {
  constructor(props) {
    super(props);
    this.renderNews = this.renderNews.bind(this);
    this.onLeftBack = this.onLeftBack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {noticeList} = nextProps;
    if(noticeList.noticeListFetched){
      nextProps.dispatch(stopHandleTimeConsuming());
      if(noticeList.error){
        showAlert(noticeList.error);
      } else if (noticeList.noticeListData._cachedRowCount == 0) {
        Alert.alert('', '暂无通知公告！', [{text: '好'},]);
      }
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchNoticeList());
    dispatch(startHandleTimeConsuming());
  }

  render() {
    const {noticeList} = this.props;
    return(
      <View style={styles.container}>
        <NavigationBar
          title={'通知'} titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../img/office/icon-backs.png')}/>
        <ListView
          dataSource={noticeList.noticeListData}
          renderRow={this.renderNews}
          style={styles.listView}/>
        <View>
          <Spinner visible={noticeList.noticeListFetching} text={'加载中,请稍后...'}/>
        </View>
      </View>
    )
  }

  renderNews(news) {
    return(
      <View style={{backgroundColor:'white'}}>
        <TouchableHighlight onPress={this.goToNext.bind(this, news.cmsId)} underlayColor='transparent'>
        <View style={styles.cellBG}>
          <Image source={iconTZ} style={styles.pic}/>
          <View style={styles.cellStyle}>
            <View style={styles.ImageStyleCell}>
              <Text style={styles.titleStyle} numberOfLines={1}>{news.TITLE}</Text>
              <Text style={styles.detailStyle}>发布时间: {news.createTime}</Text>
            </View>
            <Image source={iconNext} style={styles.iamgeStyle}/>
          </View>
        </View>
        </TouchableHighlight>
      </View>
    );
  }

  goToNext(noticeItemNum) {
    const {navigator, dispatch, login} = this.props;
    dispatch(changeWebviewUrl( NOTICE_DETIAL_URL + noticeItemNum + '&accountId=' + login.rawData.userId));
    navigator.push({
      name: "WebviewContainer",
      component: WebviewContainer,
    });
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }
}

var styles = StyleSheet.create({
  iamgeStyle: {
    width: 8,
    height:13,
		margin: 15,
		alignSelf: 'center',
		justifyContent: 'center'
  },
  ImageStyleCell: {
    flex:1,
  },
  postButton: {
    margin:10,
  },
  detailStyle: {
    flex:1,
    fontSize:12,
    color:'gray',
  },
  titleStyle: {
    marginTop:10,
    fontSize:14,
    flex:1,
    color:'#333',
  },
  cellBG: {
    flexDirection: 'row',
    flex:1,
  },
  cellStyle: {
    height:60,
    borderBottomWidth:1,
    borderBottomColor:'#e5e5e5',
    backgroundColor:"white",
    flexDirection: 'row',
    flex:1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:"#f5f5f5",
  },
  listView: {
    flex:1,
  },
  pic: {
    margin:10,
    height:30,
    width:30,
    flex:0,
  },
});
