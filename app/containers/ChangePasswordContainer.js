'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import ChangePassword from '../pages/changePassword';

class ChangePasswordContainer extends Component {

  render() {
    return (
      <ChangePassword {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {changePassword, login} = state;
  return {
    changePassword,
    login,
  }
}

export default connect(mapStateToProps)(ChangePasswordContainer);
