'use strict';
import React, {
  ListView,
} from 'react-native';

import * as types from '../constants/ActionTypes';

const initialState = {
  keyboardSpace: 0,

  formData: undefined,
  formFetching: false,
  formFetched: false,

  approvalInputData: undefined,
  tableData: [],

  approvalCommitting: false,
  approvalCommitted: false,
  commitResult: '',

  buttonFetching: false,
  buttonFetched: false,
  buttonData: [],

  otherCommitting: false,
  otherCommitted: false,
  otherCommitResult: '',

  error: '',
}

export default function taskApproval(state = initialState, action) {
  state = Object.assign({}, state, {
    formFetched: false,
    approvalCommitted: false,
    buttonFetched: false,
    otherCommitted: false,
  });
  switch (action.type) {
    case types.FETCH_TASK_APPROVAL_FROM_RESULT:
      return Object.assign({}, state, {
        formFetching: true,
        formData: [],
        tableData: [],
      });
    case types.RECEIVE_TASK_APPROVAL_FORM_RESULT:
      return Object.assign({}, state, {
        formFetching: false,
        formFetched: true,
        formData: action.formData,
        tableData: action.tableData,
        error: action.error,
      });
    case types.CHANGE_APPROVAL_FORM_KEYBOARD_SPACE:
      return Object.assign({}, state, {
        keyboardSpace: action.keyboardSpace,
      });
    case types.HANDLE_APPROVAL_USER_INPUT:
      return Object.assign({}, state, {
        approvalInputData: action.approvalInputData,
      });
    case types.FETCH_COMMIT_APPROVAL_RESULT:
      return Object.assign({}, state, {
        approvalCommitting: true,
      });
    case types.RECEIVE_COMMIT_APPROVAL_RESULT:
      return Object.assign({}, state, {
        approvalCommitting: false,
        approvalCommitted: true,
        commitResult: action.commitResult,
        error: action.error,
      });
    case types.FETCH_APPROVAL_BUTTON_RESULT:
      return Object.assign({}, state, {
        buttonFetching: true,
        buttonData: [],
      });
    case types.RECEIVE_APPROVAL_BUTTON_RESULT:
      return Object.assign({}, state, {
        buttonFetching: false,
        buttonFetched: true,
        buttonData: action.buttonData,
        error: action.error,
      });
    case types.FETCH_OTHER_APPROVAL_RESULT:
      return Object.assign({}, state, {
        otherCommitting: true,
      });
    case types.RECEIVE_OTHER_APPROVAL_RESULT:
      return Object.assign({}, state, {
        otherCommitting: false,
        otherCommitted: true,
        otherCommitResult: action.otherCommitResult,
        error: action.error,
      });
    default:
      return state;
  }
}
