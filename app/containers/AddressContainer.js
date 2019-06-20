'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import Address from '../pages/address';

class AddressContainer extends Component {

  render() {
    return (
      <Address {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {address} = state;
  return {
    address
  }
}

export default connect(mapStateToProps)(AddressContainer);
