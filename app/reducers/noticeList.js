'use strict';
import React, {
  ListView,
} from 'react-native';

import * as types from '../constants/ActionTypes';

var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const initialState = {
  noticeListData: dataSource.cloneWithRows([]),
  noticeListFetching: false,
  noticeListFetched: false,
  error: '',
}

export default function noticeList(state = initialState, action) {
  state = Object.assign({}, state, {
    noticeListFetched: false,
  });
  switch (action.type) {
    case types.FETCH_NOTICE_LIST_RESULT:
      return Object.assign({}, state, {
        noticeListFetching: true,
        noticeListData: dataSource.cloneWithRows([]),
      });
    case types.RECEIVE_NOTICE_LIST_RESULT:
      return Object.assign({}, state, {
        noticeListFetching: false,
        noticeListFetched: true,
        noticeListData: dataSource.cloneWithRows(action.responseData),
        error: action.error,
      });
    default:
      return state;
  }
}
