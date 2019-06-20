'use strict';

import * as types from '../constants/ActionTypes';
import {request} from '../utils/RequestUtils';

var contactListInputData = "{}";

export function fetchContactList(url, userId, pageNo, title, taskStatus) {
  return dispatch => {
    dispatch(fetchContactListResult(pageNo));
    contactListInputData = "{}"
    let _url = url + 'userId=' + userId + '&pageNo=' + pageNo + '&title=' + title + '&taskStatus=' + taskStatus;
    return request(_url)
      .then((responseData) => {
        dispatch(receiveContactListResult(responseData.result, '', pageNo));
      })
      .catch((error) => {
        console.error('fetchContactList error: ' + error);
        dispatch(receiveContactListResult([], error));
      })
  }
}

function fetchContactListResult(pageNo) {
  return {
    type: types.FETCH_CONTACT_LIST_RESULT,
    pageNo: pageNo,
  }
}

function receiveContactListResult(contactListData, error, pageNo) {
  return {
    type: types.RECEIVE_CONTACT_LIST_RESULT,
    contactListData: contactListData,
    pageNo: pageNo,
    error: error,
  }
}

export function fetchContactBusinessType(url) {
  return dispatch => {
    dispatch(fetchContactBusinessTypeResult());
    return request(url)
      .then((responseData) => {
        dispatch(receiveContactBusinessTypeResult(responseData));
      })
      .catch((error) => {
        console.error('fetchContactBusinessType error: ' + error);
        dispatch(receiveContactBusinessTypeResult([], error));
      })
  }
}

function fetchContactBusinessTypeResult() {
  return {
    type: types.FETCH_CONTACT_BUSINESS_TYPE_RESULT,
  }
}

function receiveContactBusinessTypeResult(responseData, error) {
  return {
    type: types.RECEIVE_CONTACT_BUSINESS_TYPE_RESULT,
    contactBusinessTypeData: responseData.serviceList,
    error: error,
  }
}

export function handleUserInput(userInputKey, userInputValue, inputType) {
  return dispatch => {
      if (userInputValue == ''){
        dispatch(deleteJson(userInputKey, inputType));
      }else{
        dispatch(setJson(userInputKey, userInputValue, inputType));
      }
  }
}

function setJson(name, value, inputType) {
    if (!contactListInputData)
      contactListInputData = "{}";
    var jsonObj = JSON.parse(contactListInputData);
    jsonObj[name] = value;
    contactListInputData = JSON.stringify(jsonObj);
    return {
      type: types.HANDLE_CONTACT_USER_INPUT,
      contactListInputData: contactListInputData,
      inputType: inputType,
    }
}

function deleteJson(name, inputType) {
    if (!contactListInputData)
      return null;
    delete contactListInputData[name];
    return {
      type: types.HANDLE_CONTACT_USER_INPUT,
      contactListInputData: contactListInputData,
      inputType: inputType,
    }
}

export function fetchContacCreate(url, jsonData) {
  return dispatch => {
    dispatch(fetchContacCreateResult());
    let body = JSON.stringify({
      jsonData: jsonData,
    });
    return request(url, 'post', body, {'Accept': 'application/json', 'Content-Type': 'application/json',})
      .then((responseData) => {
        dispatch(receiveContactCreateResult(responseData));
      })
      .catch((error) => {
        console.error('fetchContacCreate error: ' + error);
        dispatch(receiveContactCreateResult({}, error));
      })
  }
}

function fetchContacCreateResult() {
  return {
    type: types.FETCH_CONTACT_CREATE_RESULT,
  }
}

function receiveContactCreateResult(responseData, error) {
  return {
    type: types.RECEIVE_CONTACT_CREATE_RESULT,
    commitResult: responseData.code,
    error: error,
  }
}

export function fetchContactDetail(url, contactListId) {
  return dispatch => {
    dispatch(fetchContactDetailResult());
    let _url = url + contactListId;
    return request(_url)
      .then((responseData) => {
        dispatch(receiveContactDetailResult(responseData));
      })
      .catch((error) => {
        console.error('fetchContactDetail error: ' + error);
        dispatch(receiveContactDetailResult({}, error));
      })
  }
}

function fetchContactDetailResult() {
  return {
    type: types.FETCH_CONTACT_DETAIL_RESULT,
  }
}

function receiveContactDetailResult(responseData, error) {
  return {
    type: types.RECEIVE_CONTACT_DETAIL_RESULT,
    contactDetailData: responseData,
    error: error,
  }
}

export function fetchContactFollowType(url) {
  return dispatch => {
    dispatch(fetchContactFollowTypeResult());
    return request(url)
      .then((responseData) => {
        dispatch(receiveContactFollowTypeResult(responseData));
      })
      .catch((error) => {
        console.error('fetchContactFollowType error: ' + error);
        dispatch(receiveContactFollowTypeResult([], error));
      })
  }
}

function fetchContactFollowTypeResult() {
  return {
    type: types.FETCH_CONTACT_FOLLOW_TYPE_RESULT,
  }
}

function receiveContactFollowTypeResult(responseData, error) {
  return {
    type: types.RECEIVE_CONTACT_FOLLOW_TYPE_RESULT,
    contactFollowTypeData: responseData.followList,
    contactStatusTypeData: responseData.statusList,
    error: error,
  }
}

export function fetchContacApprove(url, jsonData) {
  return dispatch => {
    dispatch(fetchContacApproveResult());
    let body = JSON.stringify({
      jsonData: jsonData,
    });
    return request(url, 'post', body, {'Accept': 'application/json', 'Content-Type': 'application/json',})
      .then((responseData) => {
        dispatch(receiveContactApproveResult(responseData));
      })
      .catch((error) => {
        console.error('fetchContacApprove error: ' + error);
        dispatch(receiveContactApproveResult({}, error));
      })
  }
}

function fetchContacApproveResult() {
  return {
    type: types.FETCH_CONTACT_APPROVE_RESULT,
  }
}

function receiveContactApproveResult(responseData, error) {
  return {
    type: types.RECEIVE_CONTACT_APPROVE_RESULT,
    approveResult: responseData.code,
    error: error,
  }
}
