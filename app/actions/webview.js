'use strict';

import * as types from '../constants/ActionTypes';

export function changeWebviewUrl(webviewUrl) {
  return {
    type: types.CHANGE_WEBVIEW_URL,
    webviewUrl: webviewUrl,
  }
}
