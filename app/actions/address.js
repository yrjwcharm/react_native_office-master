'use strict';

import * as types from '../constants/ActionTypes';
import {SEARCH_ADDRESSLIST_URL} from '../constants/Network';
import { request } from '../utils/RequestUtils';

export function fetchAddressSearch(searchName) {
  return dispatch => {
    dispatch(fetchAddressSearchResult());
    return request(SEARCH_ADDRESSLIST_URL + 'nickName=' + searchName, 'get')
      .then((responseData) => {
        if (responseData) {
          dispatch(receiveAddressSearchResult(responseData));
        }
        else {
          dispatch(receiveAddressSearchResult([]));
        }
      })
      .catch((error) => {
        console.error('fetchAddressSearch error: ' + error);
        dispatch(receiveAddressSearchResult([], error));
      })
  }
}

export function changeSearchName(searchName) {
  return {
    type: types.CHANGE_ADDRESS_SEARCH_NAME,
    searchName: searchName,
  }
}

function fetchAddressSearchResult() {
  return {
    type: types.FETCH_ADDRESS_SEARCH_RESULT,
  }
}

function receiveAddressSearchResult(responseData, error) {
  return {
    type: types.RECEIVE_ADDRESS_SEARCH_RESULT,
    searchUserData: responseData,
    error: error,
  }
}

export function assignAddressListData(addressData){
  return {
    type: types.ASSIGN_ADDRESS_LIST_DATA,
    addressData: addressData,
  }
}
