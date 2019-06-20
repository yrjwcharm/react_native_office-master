'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import TaskList from '../pages/taskList';

class TaskListContainer extends Component {

  render() {
    return (
      <TaskList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {taskList, login} = state;
  return {
    taskList,
    login,
  }
}

export default connect(mapStateToProps)(TaskListContainer);
