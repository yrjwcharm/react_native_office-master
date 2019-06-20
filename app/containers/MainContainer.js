'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import Main from '../pages/main';

class MainContainer extends Component {
  render() {
    return (
      <Main {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {login, tabOffice, userInfo, tabIndex} = state;
  return {
    login,
    tabOffice,
    userInfo,
    tabIndex,
  }
}

export default connect(mapStateToProps)(MainContainer);
