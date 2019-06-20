'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import OfficeTemplateList from '../pages/officeTemplateList';

class OfficeTemplateListContainer extends Component {
  render() {
    return (
      <OfficeTemplateList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {officeTemplateList,login} = state;
  return {
    officeTemplateList,
    login,
  }
}

export default connect(mapStateToProps)(OfficeTemplateListContainer);
