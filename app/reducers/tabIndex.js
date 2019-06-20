'use strict';
import ViewPager from 'react-native-viewpager';
import * as types from '../constants/ActionTypes';
import {INDEX_TAB_DATA_BLOB} from '../constants/TabIndexItems';
import {
  ListView,
  Platform,
} from 'react-native';
import JPush from 'react-native-jpush';

var LVDataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});
var VPDataSource = new ViewPager.DataSource({
  pageHasChanged: (p1, p2) => p1 !== p2,
});
const initialState = {
  newsData: VPDataSource.cloneWithPages([]),
  indexItemdata: LVDataSource.cloneWithRows(INDEX_TAB_DATA_BLOB),
  newsFetching: false,
  newsFetched: false,
  countFetching: false,
  countFetched: false,
  isAutoPlay: false,
};

export default function tabIndex(state = initialState, action) {
  state = Object.assign({}, state, {
    newsFetched: false,
    countFetched: false,
    isAutoPlay: false,
  });
  switch (action.type) {
    case types.FETCH_NEWS_RESULT:
      return Object.assign({}, state, {
        newsFetching: true,
        newsData: VPDataSource.cloneWithPages([]),
      });
    case types.RECEIVE_NEWS_RESULT:
      return Object.assign({}, state, {
        newsFetching: false,
        newsFetched: true,
        isAutoPlay: action.isAutoPlay,
        newsData: VPDataSource.cloneWithPages(action.newsData),
      });
    case types.FETCH_TASK_COUNT_RESULT:
      return Object.assign({}, state, {
        countFetching: true,
        indexItemdata: LVDataSource.cloneWithRows(INDEX_TAB_DATA_BLOB),
      });
    case types.RECEIVE_TASK_COUNT_RESULT:
      let dataBlob = INDEX_TAB_DATA_BLOB;
      if(action.countData){
        dataBlob[1].count = action.countData.count;
        if (Platform.OS !== 'ios') {
          JPush.setBadgerNumber(action.countData.count);
        }
      }
      return Object.assign({}, state, {
        countFetching: false,
        countFetched: true,
        indexItemdata: LVDataSource.cloneWithRows(dataBlob),
      });
    default:
      return state;
  }
}
