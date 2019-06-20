'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import MessageList from '../pages/messageList';

class MessageListContainer extends Component {

  render() {
    return (
      <MessageList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {messageList, login} = state;
  return {
    messageList,
    login,
  }
}

export default connect(mapStateToProps)(MessageListContainer);
