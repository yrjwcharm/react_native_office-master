'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import UserInfo from '../pages/userInfo';

class UserInfoContainer extends Component {

  render() {
    return (
      <UserInfo {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {userInfo, login} = state;
  return {
    userInfo,
    login,
  }
}

export default connect(mapStateToProps)(UserInfoContainer);
