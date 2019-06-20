'use strict';

import * as types from '../constants/ActionTypes';
import {OFFICE_MOUDEL_URL} from '../constants/Network';
import { request } from '../utils/RequestUtils';

export function fetchOffice() {
  return dispatch => {
    dispatch(fetchOfficeItemResult());
    return request(OFFICE_MOUDEL_URL, 'get')
      .then((responseData) => {
        dispatch(receiveOfficeItemResult(responseData));
      })
      .catch((error) => {
        console.error('fetchOffice error: ' + error);
        dispatch(receiveOfficeItemResult());
      })
  }
}

function fetchOfficeItemResult() {
  return {
    type: types.FETCH_OFFICE_ITEM_RESULT,
  }
}

function receiveOfficeItemResult(officeItemData) {
  return {
    type: types.RECEIVE_OFFICE_ITEM_RESULT,
    officeItemData: officeItemData,
  }
}
