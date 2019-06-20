'use strict';

import * as types from '../constants/ActionTypes';
import {APPROVAL_DEAL_WITH_STAFF} from '../constants/Network';
import {request} from '../utils/RequestUtils';

export function fetchStaffList(userName) {
  return dispatch => {
    dispatch(fetchStaffListResult());
    let body = JSON.stringify({
      NICKNAME: userName,
    });
    return request(APPROVAL_DEAL_WITH_STAFF, 'post', body, {'Accept': 'application/json', 'Content-Type': 'application/json',})
      .then((responseData) => {
        if (responseData) {
            dispatch(receiveStaffListResult(responseData));
        } else {
            dispatch(receiveStaffListResult([]));
        }

      })
      .catch((error) => {
        console.error(('fetchStaffList error: ' + error));
        dispatch(receiveStaffListResult([], error));
      })
  }
}

function fetchStaffListResult() {
  return {
    type: types.FETCH_STAFF_LIST_RESULT,
  }
}

function receiveStaffListResult(responseData, error) {
  return {
    type: types.RECEIVE_STAFF_LIST_RESULT,
    staffListData: responseData,
    error: error,
  }
}

export function changeSearchName(searchName) {
  return {
    type: types.CHANGE_STAFF_SEARCH_NAME,
    searchName: searchName,
  }
}

export function changeStaffRemark(remark) {
  return {
    type: types.CHANGE_STAFF_REMARK,
    remark: remark,
  }
}

export function assignStaffListData(staffData){
  return {
    type: types.ASSIGN_STAFF_LIST_DATA,
    staffData: staffData,
  }
}

export function assignStaffUserId(userId, nickName){
  return {
    type: types.ASSIGN_STAFF_USER_ID,
    userId: userId,
    nickName: nickName,
  }
}
