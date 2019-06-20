'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import Login from '../pages/login';

class LoginContainer extends Component {

  render() {
    return (
      <Login {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {login} = state;
  return {
    login,
  }
}

export default connect(mapStateToProps)(LoginContainer);
