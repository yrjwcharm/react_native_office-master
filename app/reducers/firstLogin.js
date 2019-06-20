'use strict'
import * as types from '../constants/ActionTypes';

const initialState = {
  keyboardSpace: undefined,
  newPassword: '',
  confirmPassword: '',
  email: '',
  telephone: '',
  firstLoading: false,
  firstLoaded: false,
  firstLoadResult: '',
  msg: '',
  error: '',
}

export default function firstLogin(state = initialState, action){
  state = Object.assign({}, state, {
    firstLoaded: false
  });
  switch (action.type) {
    case types.FETCH_FIRSTLOGIN_RESULT:
      return Object.assign({}, state, {
        firstLoading: true,
      });
      break;
    case types.CHANGE_FIRSTLOGIN_KEYBOARD_SPACE:
      return Object.assign({}, state, {
        keyboardSpace: action.keyboardSpace,
      });
      break;
    case  types.RECETIVE_FIRSTLOGIN_RESULT:
    return Object.assign({}, state, {
      firstLoading: false,
      firstLoaded: true,
      firstLoadedResult: action.firstLoadedResult,
      msg: action.msg,
      error: action.error,
    });
      break;
    case types.FIRSTLOGIN:
     if (action.newPassword != undefined && action.newPassword.length >= 0) {
        return Object.assign({}, state, {
          newPassword: action.newPassword,
        });
      } else if (action.confirmPassword != undefined && action.confirmPassword.length >= 0) {
        return Object.assign({}, state, {
          confirmPassword: action.confirmPassword,
        });
      }else if (action.email != undefined && action.email.length >= 0) {
        return Object.assign({}, state, {
          email: action.email,
        });
      }else if (action.telephone != undefined && action.telephone.length >= 0) {
          return Object.assign({}, state, {
          telephone: action.telephone,
          });
      } else {
        return state;
      }
          break;
    default:

      return state;
  }
}
