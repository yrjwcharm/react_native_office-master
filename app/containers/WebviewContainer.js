'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import Webview from '../pages/webview';

class WebviewContainer extends Component {

  render() {
    return (
      <Webview {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {webview} = state;
  return {
    webview
  }
}

export default connect(mapStateToProps)(WebviewContainer);
