'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import OfficeTable from '../pages/officeTable';

class OfficeTableContainer extends Component {
  render() {
    return (
      <OfficeTable {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {officeForm} = state;
  return {
    officeForm
  }
}

export default connect(mapStateToProps)(OfficeTableContainer);
