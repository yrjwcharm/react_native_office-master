'use strict';
import React, {
  ListView,
} from 'react-native';

import * as types from '../constants/ActionTypes';

var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const initialState = {
  searchname: '',
  searchUserData: dataSource.cloneWithRows([]),
  addressFetching: false,
  addressFetched: false,
  error: '',
}

export default function address(state = initialState, action) {
  state = Object.assign({}, state, {
    addressFetched: false,
  });
  switch (action.type) {
    case types.FETCH_ADDRESS_SEARCH_RESULT:
      return Object.assign({}, state, {
        addressFetching: true,
        searchUserData: dataSource.cloneWithRows([]),
      });
    case types.RECEIVE_ADDRESS_SEARCH_RESULT:
      return Object.assign({}, state, {
        addressFetching: false,
        addressFetched: true,
        searchUserData: dataSource.cloneWithRows(action.searchUserData),
        error: action.error,
        searchName: '',
      });
    case types.CHANGE_ADDRESS_SEARCH_NAME:
      return Object.assign({}, state, {
        searchName: action.searchName,
      });
    case types.ASSIGN_ADDRESS_LIST_DATA:
      return Object.assign({}, state, {
        searchUserData: dataSource.cloneWithRows(action.addressData),
      });
    default:
      return state;
  }
}
