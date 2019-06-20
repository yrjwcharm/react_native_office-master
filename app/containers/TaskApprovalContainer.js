'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import TaskApproval from '../pages/taskApproval';

class TaskApprovalContainer extends Component {

  render() {
    return (
      <TaskApproval {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {taskApproval, login} = state;
  return {
    taskApproval,
    login,
  }
}

export default connect(mapStateToProps)(TaskApprovalContainer);
