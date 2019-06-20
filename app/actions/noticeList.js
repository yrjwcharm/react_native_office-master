'use strict';

import * as types from '../constants/ActionTypes';
import {request} from '../utils/RequestUtils';
import {NOTICE_URL} from '../constants/Network'

export function fetchNoticeList(url) {
  return dispatch => {
    dispatch(fetchNoticeListResult());
    return request(NOTICE_URL)
      .then((responseData) => {
        if (responseData) {
            dispatch(receiveNoticeListResult(responseData.contentList));
        } else {
          dispatch(receiveNoticeListResult([]));
        }
      })
      .catch((error) => {
        console.error('fetchNoticeList error: ' + error);
        dispatch(receiveNoticeListResult([], error));
      })
  }
}

function fetchNoticeListResult() {
  return {
    type: types.FETCH_NOTICE_LIST_RESULT,
  }
}

function receiveNoticeListResult(responseData, error) {
  return {
    type: types.RECEIVE_NOTICE_LIST_RESULT,
    responseData: responseData,
    error: error,
  }
}
