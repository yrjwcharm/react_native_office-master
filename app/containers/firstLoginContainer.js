'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import FirstLogin from '../pages/firstLogin';

class firstLoginContainer extends Component {

  render() {
    return (
      <FirstLogin {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {firstLogin, login} = state;
  return {
    firstLogin,
    login,
  }
}

export default connect(mapStateToProps)(firstLoginContainer);
