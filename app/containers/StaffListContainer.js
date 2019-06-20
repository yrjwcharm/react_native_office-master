'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import StaffList from '../pages/staffList';

class StaffListContainer extends Component {
  render() {
    return (
      <StaffList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {staffList, login} = state;
  return {
    staffList,
    login,
  }
}

export default connect(mapStateToProps)(StaffListContainer);
