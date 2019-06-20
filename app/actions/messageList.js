'use strict';

import * as types from '../constants/ActionTypes';
import {request} from '../utils/RequestUtils';
import {MESSAGE_URL} from '../constants/Network'

export function fetchMessageList(userId) {
  return dispatch => {
    dispatch(fetchMessageListResult());
    return request(MESSAGE_URL + userId)
      .then((responseData) => {
        if (responseData) {
          dispatch(receiveMessageListResult(responseData));
        } else {
          dispatch(receiveMessageListResult([]));
        }
      })
      .catch((error) => {
        console.error('fetchMessageList error: ' + error);
        dispatch(receiveMessageListResult([], error));
      })
  }
}

function fetchMessageListResult() {
  return {
    type: types.FETCH_MESSAGE_LIST_RESULT,
  }
}

function receiveMessageListResult(responseData, error) {
  return {
    type: types.RECEIVE_MESSAGE_LIST_RESULT,
    responseData: responseData,
    error: error,
  }
}
