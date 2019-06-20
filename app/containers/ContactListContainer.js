'use strict';

import React, { Component, } from 'react';
import {connect} from 'react-redux';
import ContactListBase from '../pages/contactList/contactListBase';
import ContactListBuilder from '../pages/contactList/contactListBuilder';
import ContactListDetail from '../pages/contactList/contactListDetail';
import ContactListApprove from '../pages/contactList/contactListApprove';
import * as types from '../constants/NavigatorTypes';

class ContactListContainer extends Component {

  render() {
    switch(this.props.route.type){
      case types.CONTACT_LIST_BASE:
        return (
          <ContactListBase {...this.props} />
        );
      case types.CONTACT_LIST_BUILDER:
        return (
          <ContactListBuilder {...this.props} />
        );
      case types.CONTACT_LIST_DETAIL:
        return (
          <ContactListDetail {...this.props} />
        );
      case types.CONTACT_LIST_APPROVE:
        return (
          <ContactListApprove {...this.props} />
        );
      default:
       return (
         <View></View>
       );
    }
  }
}

function mapStateToProps(state) {
  const {contactListBase, login} = state;
  return {
    contactListBase,
    login,
  }
}

export default connect(mapStateToProps)(ContactListContainer);
