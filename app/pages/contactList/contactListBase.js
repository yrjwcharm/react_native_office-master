'use strict';

import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
  Alert,
  Linking,
  InteractionManager,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

import Colors from '../../constants/Colors';
import ZqOfficeTabBar from '../../components/ZqOfficeTabBar';
import NavigationBar from '../../components/ZqOfficeNavigationBar';
import Spinner from '../../lib/react-native-loading-spinner-overlay';
import ContactListView from './contactListView';
import ContactListContainer from '../../containers/ContactListContainer';
import * as types from '../../constants/NavigatorTypes';
import * as common from './common';

var HEIGHT = Dimensions.get('window').height;
var searchTitle;

const CONTACTLIST_TAB_PROGRESS = '进行中';
const CONTACTLIST_TAB_COMPLETE = '已完成';
const CONTACTLIST_TAB_INCOMPLETE = '未完成';
const CONTACTLIST_TAB_OVERDUE = '逾期完成';

export default class ContactListBase extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        page: CONTACTLIST_TAB_PROGRESS,
        searchTitle: '',
      };
      this.onLeftBack = this.onLeftBack.bind(this);
      this.onCreate = this.onCreate.bind(this);
      this.onSearch = this.onSearch.bind(this);
      this.clearText = this.clearText.bind(this);
  }

  componentShouldUpdate(nextProps, nextState){
    if(this.state.searchTitle !== nextState.searchTitle)
      return false;
  }

  componentWillUpdate(nextProps, nextState){
    if(this.state.page !== nextState.page)
      this.setState({searchTitle: ''});
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.setState({
      searchTitle: '',
    });
  }

  renderPage() {
    if(this.state.page === CONTACTLIST_TAB_PROGRESS){
      return (
        <ContactListView {...this.props} searchTitle={this.state.searchTitle} onClear={() => {this.clearText()}}
          listType={common.CONTACT_LIST_TYPE_PROGRESS} statusColor={'red'}/>
      );
    }else if(this.state.page === CONTACTLIST_TAB_COMPLETE){
      return (
        <ContactListView {...this.props} searchTitle={this.state.searchTitle} onClear={() => {this.clearText()}}
          listType={common.CONTACT_LIST_TYPE_COMPLETE} statusColor={'green'}/>
      );
    }else if(this.state.page === CONTACTLIST_TAB_INCOMPLETE){
      return (
        <ContactListView {...this.props} searchTitle={this.state.searchTitle} onClear={() => {this.clearText()}}
          listType={common.CONTACT_LIST_TYPE_INCOMPLETE} statusColor={'red'}/>
      );
    }else if(this.state.page === CONTACTLIST_TAB_OVERDUE){
      return (
        <ContactListView {...this.props} searchTitle={this.state.searchTitle} onClear={() => {this.clearText()}}
          listType={common.CONTACT_LIST_TYPE_OVERDUE} statusColor={'red'}/>
      );
    }
  }

  render() {
    const {contactListBase} = this.props;
    return (
      <View style={styles.container}>
        <NavigationBar title='工作联系单' titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack}
          leftButtonIcon={require('../../img/office/icon-backs.png')}
          rightButtonTitle={'新建'} rightButtonTitleColor={'#fff'}
          onRightButtonPress={this.onCreate}/>
        <ZqOfficeTabBar selected={this.state.page} style={{backgroundColor: '#322a33', height: 50, top: 48}}
          onSelect={el => this.setState({page: el.props.name})}>
          <Text
            name={CONTACTLIST_TAB_PROGRESS}
            style={{color: Colors.white}}
            selectedStyle={{color: Colors.mainColor}}
            selectedIconStyle={{borderBottomWidth: 2, borderBottomColor: '#ef6c00'}}>{CONTACTLIST_TAB_PROGRESS}</Text>
          <Text
            name={CONTACTLIST_TAB_COMPLETE}
            style={{color: Colors.white}}
            selectedStyle={{color: Colors.mainColor}}
            selectedIconStyle={{borderBottomWidth: 2, borderBottomColor: '#ef6c00'}}>{CONTACTLIST_TAB_COMPLETE}</Text>
          <Text
            name={CONTACTLIST_TAB_INCOMPLETE}
            style={{color: Colors.white}}
            selectedStyle={{color: Colors.mainColor}}
            selectedIconStyle={{borderBottomWidth: 2, borderBottomColor: '#ef6c00'}}>{CONTACTLIST_TAB_INCOMPLETE}</Text>
          <Text
            name={CONTACTLIST_TAB_OVERDUE}
            style={{color: Colors.white}}
            selectedStyle={{color: Colors.mainColor}}
            selectedIconStyle={{borderBottomWidth: 2, borderBottomColor: '#ef6c00'}}>{CONTACTLIST_TAB_OVERDUE}</Text>
        </ZqOfficeTabBar >
        <View style={styles.searchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              ref={'textInput'}
              value = {searchTitle}
              style={styles.textInput}
              onChangeText={(search) => {searchTitle = search}}
              placeholder='请输入工作单查找'
              returnKeyType={'search'}/>
          </View>
          <TouchableOpacity onPress={this.onSearch} style={styles.searchButton}>
            <Text>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainPage}>
          {
            this.renderPage()
          }
        </View>
        <TouchableOpacity style={styles.numberButton}>
          <Text style={{color: Colors.white, fontSize: 20}} source={require('../../img/icon/icon-fb-edit.png')}>0</Text>
        </TouchableOpacity>
        <View>
          <Spinner visible={contactListBase.contactListFetching} text={'加载中,请稍后...'}/>
        </View>
      </View>
    );
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onCreate() {
    const {navigator} = this.props;
    navigator.push({
      name: "ContactListContainer",
      component: ContactListContainer,
      type: types.CONTACT_LIST_BUILDER,
    });
  }

  onSearch() {
    this.setState({searchTitle: searchTitle});
  }

  clearText() {
		this.refs.textInput.clear();
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 50,
    elevation: 2,
    backgroundColor: Colors.lightgrey,
  },
  textInput: {
    height: 31,
    fontSize: 13,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: Colors.white,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 34,
    margin: 8,
    elevation: 3,
    borderRadius: 15,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  searchButton: {
    height: 32,
    width: 64,
    margin: 8,
    elevation: 3,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor,
  },
  mainPage: {
    height: Platform.OS === 'ios' ? HEIGHT - 148 : HEIGHT - 173,
  },
  numberButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.mainColor,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
