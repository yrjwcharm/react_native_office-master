'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import TextInput from '../pages/textInput';

class TextInputContainer extends Component {
  render() {
    return (
      <TextInput {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {textInput, taskApproval, staffList} = state;
  return {
    textInput,
    taskApproval,
    staffList,
  }
}

export default connect(mapStateToProps)(TextInputContainer);
