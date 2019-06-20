'use strict';
import React, {
  ListView,
} from 'react-native';

import * as types from '../constants/ActionTypes';

var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const initialState = {
  messageListData: dataSource.cloneWithRows([]),
  messageListFetching: false,
  messageListFetched: false,
  error: '',
}

export default function messageList(state = initialState, action) {
  state = Object.assign({}, state, {
    messageListFetched: false,
  });
  switch (action.type) {
    case types.FETCH_MESSAGE_LIST_RESULT:
      return Object.assign({}, state, {
        messageListFetching: true,
        messageListData: dataSource.cloneWithRows([]),
      });
    case types.RECEIVE_MESSAGE_LIST_RESULT:
      return Object.assign({}, state, {
        messageListFetching: false,
        messageListFetched: true,
        messageListData: dataSource.cloneWithRows(action.responseData),
        error: action.error,
      });
    default:
      return state;
  }
}
