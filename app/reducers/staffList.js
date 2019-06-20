'use strict';
import React, {
  ListView,
} from 'react-native';

import * as types from '../constants/ActionTypes';

var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const initialState = {
  staffListData: dataSource.cloneWithRows([]),
  staffData: [],
  staffListFetching: false,
  staffListFetched: false,
  searchName: '',
  error: '',
  userId: '',
  nickName: '',
  remark: '',
}

export default function StaffList(state = initialState, action) {
  state = Object.assign({}, state, {
    staffListFetched: false,
  });
  switch (action.type) {
    case types.FETCH_STAFF_LIST_RESULT:
      return Object.assign({}, state, {
        staffListFetching: true,
        staffListData: dataSource.cloneWithRows([]),
      });
    case types.RECEIVE_STAFF_LIST_RESULT:
      return Object.assign({}, state, {
        staffListFetching: false,
        staffListFetched: true,
        staffListData: dataSource.cloneWithRows(action.staffListData),
        staffData: action.staffListData,
        error: action.error,
        userId: '',
        remark: '',
        nickName: '',
        searchName: '',
      });
    case types.CHANGE_STAFF_SEARCH_NAME:
      return Object.assign({}, state, {
        searchName: action.searchName,
      });
    case types.CHANGE_STAFF_REMARK:
      return Object.assign({}, state, {
        remark: action.remark,
      });
    case types.ASSIGN_STAFF_LIST_DATA:
      return Object.assign({}, state, {
        staffData: action.staffData,
        staffListData: dataSource.cloneWithRows(action.staffData),
      });
    case types.ASSIGN_STAFF_USER_ID:
      return Object.assign({}, state, {
        userId: action.userId,
        nickName: action.nickName,
      });
    default:
      return state;
  }
}
