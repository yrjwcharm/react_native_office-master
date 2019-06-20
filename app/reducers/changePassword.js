'use strict';

import * as types from '../constants/ActionTypes';

const initialState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',

  passwordChanging: false,
  passwordChanged: false,
  changeResult: '',
  msg: '',
  error: '',
}

export default function changePassword(state = initialState, action) {
  state = Object.assign({}, state, {
    passwordChanged: false,
  });

  switch (action.type) {
    case types.FETCH_CHANGE_PASSWORD_RESULT:
      return Object.assign({}, state, {
        passwordChanging: true,
      });
    case types.RECEIVE_CHANGE_PASSWORD_RESULT:
      return Object.assign({}, state, {
        passwordChanging: false,
        passwordChanged: true,
        changeResult: action.changeResult,
        msg: action.msg,
        error: action.error,
      });
    case types.CHANGE_NEW_PASSWORD:
      if (action.oldPassword != undefined && action.oldPassword.length >= 0) {
        return Object.assign({}, state, {
          oldPassword: action.oldPassword,
        });
      } else if (action.newPassword != undefined && action.newPassword.length >= 0) {
        return Object.assign({}, state, {
          newPassword: action.newPassword,
        });
      } else if (action.confirmPassword != undefined && action.confirmPassword.length >= 0) {
        return Object.assign({}, state, {
          confirmPassword: action.confirmPassword,
        });
      }
    default:
      return state;
  }
}
