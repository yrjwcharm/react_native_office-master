'use strict';
import React, {
  ListView,
} from 'react-native';

import * as types from '../constants/ActionTypes';
import * as common from '../pages/contactList/common';

const initialState = {
  contactListData: [],
  contactListFetching: false,
  contactListFetched: false,
  contactListFetchingMore: false,
  contactListHasMore: true,

  contactListCreateInputData: {},
  contactListReportInputData: {},
  contactListFollowInputData: {},

  contactBusinessTypeData: [],
  contactBusinessTypeFetching: false,
  contactBusinessTypeFetched: false,

  contactCreateResult: {},
  contactCreateCommitting: false,
  contactCreateCommitted: false,

  contactDetailData: {},
  contactDetailFetching: false,
  contactDetailFetched: false,

  contactFollowTypeData: [],
  contactStatusTypeData: [],
  contactFollowTypeFetching: false,
  contactFollowTypeFetched: false,

  contactApproveResult: {},
  contactApproveCommitting: false,
  contactApproveCommitted: false,

  error: '',
}

export default function contactListBase(state = initialState, action) {
  state = Object.assign({}, state, {
    contactListFetched: false,
    contactBusinessTypeFetched: false,
    contactCreateCommitted: false,
    contactDetailFetched: false,
    contactFollowTypeFetched: false,
    contactApproveCommitted: false,
  });
  switch (action.type) {
    case types.FETCH_CONTACT_LIST_RESULT:
      if(action.pageNo == 1) {
        return Object.assign({}, state, {
          contactListFetching: true,
          contactListData: [],
        });
      } else {
        return Object.assign({}, state, {
          contactListFetchingMore: true,
        });
      }
    case types.RECEIVE_CONTACT_LIST_RESULT:
      return Object.assign({}, state, {
        contactListData: state.contactListFetchingMore ? state.contactListData.concat(action.contactListData) : action.contactListData,
        contactListFetchingMore: false,
        contactListFetching: false,
        contactListFetched: true,
        contactListHasMore: action.contactListData.length < 20 ? false : true,
        error: action.error,
      });
    case types.FETCH_CONTACT_BUSINESS_TYPE_RESULT:
      return Object.assign({}, state, {
        contactBusinessTypeData: [],
        contactBusinessTypeFetching: true,
        contactListCreateInputData: {},
      });
    case types.RECEIVE_CONTACT_BUSINESS_TYPE_RESULT:
      return Object.assign({}, state, {
        contactBusinessTypeData: action.contactBusinessTypeData,
        contactBusinessTypeFetching: false,
        contactBusinessTypeFetched: true,
        error: action.error,
      });
    case types.HANDLE_CONTACT_USER_INPUT:
      if(action.inputType === common.CONTACT_INUPT_TYPE_CREATE){
        return Object.assign({}, state, {
          contactListCreateInputData: action.contactListInputData,
        });
      } else if(action.inputType === common.CONTACT_INUPT_TYPE_REPORT) {
        return Object.assign({}, state, {
          contactListReportInputData: action.contactListInputData,
        });
      } else if(action.inputType === common.CONTACT_INUPT_TYPE_FOLLOW) {
        return Object.assign({}, state, {
          contactListFollowInputData: action.contactListInputData,
        });
      }
    case types.FETCH_CONTACT_CREATE_RESULT:
      return Object.assign({}, state, {
        responseData: {},
        contactCreateCommitting: true,
      });
    case types.RECEIVE_CONTACT_CREATE_RESULT:
      return Object.assign({}, state, {
        contactCreateResult: action.commitResult,
        contactCreateCommitting: false,
        contactCreateCommitted: true,
        error: action.error,
      });
    case types.FETCH_CONTACT_DETAIL_RESULT:
      return Object.assign({}, state, {
        contactDetailFetching: true,
      });
    case types.RECEIVE_CONTACT_DETAIL_RESULT:
      return Object.assign({}, state, {
        contactDetailData: action.contactDetailData,
        contactDetailFetching: false,
        contactDetailFetched: true,
        error: action.error,
        contactListFollowInputData: {},
        contactListReportInputData: {},
      });
    case types.FETCH_CONTACT_FOLLOW_TYPE_RESULT:
      return Object.assign({}, state, {
        contactFollowTypeData: [],
        contactStatusTypeData: [],
        contactFollowTypeFetching: true,
      });
    case types.RECEIVE_CONTACT_FOLLOW_TYPE_RESULT:
      return Object.assign({}, state, {
        contactFollowTypeData: action.contactFollowTypeData,
        contactStatusTypeData: action.contactStatusTypeData,
        contactFollowTypeFetching: false,
        contactFollowTypeFetched: true,
        error: action.error,
      });
    case types.FETCH_CONTACT_APPROVE_RESULT:
      return Object.assign({}, state, {
        responseData: {},
        contactApproveCommitting: true,
      });
    case types.RECEIVE_CONTACT_APPROVE_RESULT:
      return Object.assign({}, state, {
        contactApproveResult: action.approveResult,
        contactApproveCommitting: false,
        contactApproveCommitted: true,
        error: action.error,
      });
    default:
      return state;
  }
}
