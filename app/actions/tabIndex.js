'use strict';

import * as types from '../constants/ActionTypes';
import {NEW_GET, NEW_GETIMAGE, TASKCOUNT_URL} from '../constants/Network';
import { request } from '../utils/RequestUtils';

export function fetchNews() {
  return dispatch => {
    dispatch(fetchNewsResult());
    return request(NEW_GET, 'get')
      .then((responseData) => {
        if (responseData) {
          for (let i = 0; i < responseData.length; i++) {
            responseData[i].path = NEW_GETIMAGE + responseData[i].path;
          }
          dispatch(receiveNewsResult(responseData,true));
        } else {
            dispatch(receiveNewsResult([],false));
        }
      })
      .catch((error) => {
        console.error('fetchNews error: ' + error);
        dispatch(receiveNewsResult([],false));
      })
  }
}

function fetchNewsResult() {
  return {
    type: types.FETCH_NEWS_RESULT,
  }
}

function receiveNewsResult(newsData, isAutoPlay) {
  return {
    type: types.RECEIVE_NEWS_RESULT,
    isAutoPlay: isAutoPlay,
    newsData: newsData,
  }
}

export function fetchTaskCount(userId) {
  return dispatch => {
    dispatch(fetchNewsResult());
    let url = TASKCOUNT_URL + 'userId=' + userId;
    return request(url, 'get')
      .then((responseData) => {
        if (responseData.count !== undefined) {
          dispatch(receiveTaskCountResult(responseData));
        } else {
          dispatch(receiveTaskCountResult());
        }
      })
      .catch((error) => {
        dispatch(receiveTaskCountResult());
      })
  }
}

function fetchTaskCountResult() {
  return {
    type: types.FETCH_TASK_COUNT_RESULT,
  }
}

function receiveTaskCountResult(countData) {
  return {
    type: types.RECEIVE_TASK_COUNT_RESULT,
    countData: countData,
  }
}
