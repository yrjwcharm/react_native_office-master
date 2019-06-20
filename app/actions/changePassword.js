'use strict';

import * as types from '../constants/ActionTypes';
import {EDIT_USER_INFO_URL} from '../constants/Network';
import FileManager from 'react-native-fs';
import { request } from '../utils/RequestUtils';

export function fetchChangePassword(userName, oldPassword, newPassword) {
  return dispatch => {
    let body = JSON.stringify({
      userName: userName,
      oldPassword: oldPassword,
      newPassword: newPassword,
    })
    dispatch(fetchChangePasswordResult());
    return request(EDIT_USER_INFO_URL, "post", body, {'Accept': 'application/json', 'Content-Type': 'application/json',})
      .then((responseData) => {
        dispatch(receiveChangePasswordResult(responseData));
      })
      .catch((error) => {
        console.error('fetchChangePassword error: ' + error);
        dispatch(receiveChangePasswordResult({}, error));
      })
  }
}

function fetchChangePasswordResult() {
  return {
    type: types.FETCH_CHANGE_PASSWORD_RESULT,
  }
}

function receiveChangePasswordResult(responseData, error) {
  return {
    type: types.RECEIVE_CHANGE_PASSWORD_RESULT,
    changeResult: responseData.code,
    msg :responseData.msg,
    error: error,
  }
}

export function changeUserPassword({oldPassword, newPassword, confirmPassword}) {
  return {
    type: types.CHANGE_NEW_PASSWORD,
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmPassword: confirmPassword,
  }
}
