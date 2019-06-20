'use strict';

import {combineReducers} from 'redux';
import login from './login';
import tabOffice from './tabOffice';
import webview from './webview';
import address from './address';
import userInfo from './userInfo';
import changePassword from './changePassword';
import officeTemplateList from './officeTemplateList';
import officeForm from './officeForm';
import taskList from './taskList';
import taskDetail from './taskDetail';
import taskApproval from './taskApproval';
import tabIndex from './tabIndex';
import noticeList from './noticeList';
import timeConsuming from './timeConsuming';
import firstLogin from './firstLogin';
import staffList from './staffList';
import messageList from './messageList';
import contactListBase from './contactListBase';

const rootReducer = combineReducers({
	login,
	tabOffice,
	webview,
	address,
	userInfo,
	changePassword,
	officeTemplateList,
	officeForm,
	taskList,
	taskDetail,
	taskApproval,
	tabIndex,
	noticeList,
	timeConsuming,
	firstLogin,
	staffList,
	messageList,
	contactListBase,
})

export default rootReducer;
