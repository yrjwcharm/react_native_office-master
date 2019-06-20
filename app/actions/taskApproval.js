'use strict';

import * as types from '../constants/ActionTypes';
import {request} from '../utils/RequestUtils';
import {VIEWTASKFROM_URL, APPROVAL_TASK, APPROVAL_DEAL_WITH_BUTTON, APPROVAL_DEAL_WITH} from '../constants/Network';

var approvalInputData = "{}";

export function fetchTaskApproval(taskId) {
  return dispatch => {
    dispatch(fetchTaskApprovalResult());
    let url = VIEWTASKFROM_URL + 'humanTaskId=' + taskId;
    return request(url)
      .then((responseData) => {
        if (responseData) {
          approvalInputData = "{}";
          dispatch(receiveTaskApprovalResult(responseData, responseData.listctrlVoList));
        } else {
            dispatch(receiveTaskApprovalResult(undefined, undefined, ));
        }

      })
      .catch((error) => {
        console.error('fetchTaskApproval error: ' + error);
        dispatch(receiveTaskApprovalResult(undefined, undefined, error));
      })
  }
}

function fetchTaskApprovalResult() {
  return {
    type: types.FETCH_TASK_APPROVAL_FROM_RESULT,
  }
}

function receiveTaskApprovalResult(formData, tableData, error) {
  return {
    type: types.RECEIVE_TASK_APPROVAL_FORM_RESULT,
    formData: formData,
    tableData: tableData,
    error: error,
  }
}

export function changeKeyboardSpace(keyboardSpace) {
  return {
    type: types.CHANGE_APPROVAL_FORM_KEYBOARD_SPACE,
    keyboardSpace: keyboardSpace,
  }
}

export function handleUserInput(userInputKey, userInputValue) {
  return dispatch => {
    // if (userInputValue == '')
    //   dispatch(deleteJson(userInputKey));
    // else
      dispatch(setJson(userInputKey, userInputValue));
  }
}

function setJson(name, value) {
  if (!approvalInputData)
    approvalInputData = "{}";
  var jsonObj = JSON.parse(approvalInputData);
  jsonObj[name] = value;
  approvalInputData = JSON.stringify(jsonObj)
  return {
    type: types.HANDLE_APPROVAL_USER_INPUT,
    approvalInputData: approvalInputData,
  }
}

// function deleteJson(name) {
//   if (!approvalInputData)
//     return null;
//   var jsonObj = JSON.parse(approvalInputData);
//   delete jsonObj[name];
//   approvalInputData = JSON.stringify(jsonObj)
//   return {
//     type: types.HANDLE_APPROVAL_USER_INPUT,
//     approvalInputData: approvalInputData,
//   }
// }

export function fetchCommitApproval(formData, tableData, userId, taskId,) {
  return dispatch => {
    dispatch(fetchCommitApprovalResult());
    let url = APPROVAL_TASK + 'userId=' + userId + '&humanTaskId=' + taskId;
    let body = JSON.stringify({
       formData: formData,
       tableData: tableData,
     });
    return request(url, 'post', body, {'Accept': 'application/json', 'Content-Type': 'application/json',})
      .then((responseData) => {
        if (responseData) {
          dispatch(receiveCommitApprovalResult(responseData));
        } else {
          dispatch(receiveCommitApprovalResult({}));
        }
      })
      .catch((error) => {
        console.error('fetchCommitApproval error: ' + error);
        dispatch(receiveCommitApprovalResult({}, error));
      })
  }
}

function fetchCommitApprovalResult() {
  return {
    type: types.FETCH_COMMIT_APPROVAL_RESULT,
  }
}

function receiveCommitApprovalResult(responseData, error) {
  return {
    type: types.RECEIVE_COMMIT_APPROVAL_RESULT,
    commitResult: responseData.code,
    error: error,
  }
}

export function fetchApprovalButton(taskId) {
  return dispatch => {
    dispatch(fetchApprovalButtonResult());
    let url = APPROVAL_DEAL_WITH_BUTTON + taskId;
    return request(url)
      .then((responseData) => {
        if (responseData) {
            dispatch(receiveApprovalButtonResult(responseData));
        } else {
          dispatch(receiveApprovalButtonResult(undefined));
        }

      })
      .catch((error) => {
        console.error('fetchApprovalButton error: ' + error);
        dispatch(receiveApprovalButtonResult(undefined, error));
      })
  }
}

function fetchApprovalButtonResult() {
  return {
    type: types.FETCH_APPROVAL_BUTTON_RESULT,
  }
}

function receiveApprovalButtonResult(buttonData, error) {
  return {
    type: types.RECEIVE_APPROVAL_BUTTON_RESULT,
    buttonData: buttonData,
    error: error,
  }
}

export function fetchOtherApproval(taskId, type, userId, remark) {
  return dispatch => {
    dispatch(fetchOtherApprovalResult());
    let url = APPROVAL_DEAL_WITH + 'humanTaskId=' + taskId + '&userId=' + userId
      + '&remark=' + remark + '&type=' +type;
    return request(url)
      .then((responseData) => {
        if (responseData) {
            dispatch(receiveOtherApprovalResult(responseData));
        } else {
            dispatch(receiveOtherApprovalResult(undefined));
        }
      })
      .catch((error) => {
        console.error('fetchOtherApproval error: ' + error);
        dispatch(receiveOtherApprovalResult(undefined, error));
      })
  }
}

function fetchOtherApprovalResult() {
  return {
    type: types.FETCH_OTHER_APPROVAL_RESULT,
  }
}

function receiveOtherApprovalResult(responseData, error) {
  return {
    type: types.RECEIVE_OTHER_APPROVAL_RESULT,
    otherCommitResult: responseData.code,
    error: error,
  }
}
