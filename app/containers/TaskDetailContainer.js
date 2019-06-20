'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import TaskDetail from '../pages/taskDetail';

class TaskDetailContainer extends Component {

  render() {
    return (
      <TaskDetail {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {taskDetail} = state;
  return {
    taskDetail,
  }
}

export default connect(mapStateToProps)(TaskDetailContainer);
