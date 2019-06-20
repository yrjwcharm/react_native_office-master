'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import NoticeList from '../pages/noticeList';

class NoticeListContainer extends Component {

  render() {
    return (
      <NoticeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {noticeList, login,} = state;
  return {
    noticeList,
    login,
  }
}

export default connect(mapStateToProps)(NoticeListContainer);
