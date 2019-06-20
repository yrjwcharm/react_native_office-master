'use strict';

import * as types from '../constants/ActionTypes';
import {EDIT_USER_INFO_URL} from '../constants/Network';
import FileManager from 'react-native-fs';
import { request } from '../utils/RequestUtils';

export function fetchFirstLoginSet(userName, oldPassword, newPassword, telephone, email,) {
  return dispatch => {
    let body = JSON.stringify({
      userName: userName,
      oldPassword: oldPassword,
      newPassword: newPassword,
      email: email,
      telephone: telephone,
    })
    dispatch(fetchFirstLoginSetResult());
    return request(EDIT_USER_INFO_URL, "post", body, {'Accept': 'application/json', 'Content-Type': 'application/json',})
      .then((responseData) => {
        dispatch(receivefetchFirstLoginSetResult(responseData));
      })
      .catch((error) => {
        console.error('firstLoginSet error: ' + error);
        dispatch(receivefetchFirstLoginSetResult({}, error));
      })
  }
}

function fetchFirstLoginSetResult() {
  return {
    type: types.FETCH_FIRSTLOGIN_RESULT,
  }
}

export function changeKeyboardSpace(keyboardSpace) {
  return {
    type: types.CHANGE_FIRSTLOGIN_KEYBOARD_SPACE,
    keyboardSpace: keyboardSpace,
  }
}

function receivefetchFirstLoginSetResult(responseData, error) {
  return {
    type: types.RECETIVE_FIRSTLOGIN_RESULT,
    firstLoadedResult: responseData.code,
    msg : responseData.msg,
    error: error,
  }
}

export function firstLoginSet({newPassword, confirmPassword, email, telephone}) {
  return {
    type: types.FIRSTLOGIN,
    newPassword: newPassword,
    confirmPassword: confirmPassword,
    email: email,
    telephone: telephone,
  }
}
