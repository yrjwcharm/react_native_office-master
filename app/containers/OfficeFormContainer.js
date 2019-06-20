'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import OfficeForm from '../pages/officeForm';

class OfficeFormContainer extends Component {
  render() {
    return (
      <OfficeForm {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {officeForm, login} = state;
  return {
    officeForm,
    login,
  }
}

export default connect(mapStateToProps)(OfficeFormContainer);
