'use strict';

import React from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';

import Colors from '../constants/Colors';
import NavigationBar from '../components/ZqOfficeNavigationBar';
import Spinner from '../lib/react-native-loading-spinner-overlay';

import {fetchAddressSearch, changeSearchName, assignAddressListData} from '../actions/address';
import {startHandleTimeConsuming, stopHandleTimeConsuming} from '../actions/timeConsuming';
import {showAlert} from '../utils/RequestUtils';

String.prototype.LTrim = function() {
  return this.replace(/(^\s*)/g, "");
}

String.prototype.RTrim = function() {
  return this.replace(/(\s*$)/g, "");
}

const deviceHeight = Dimensions.get('window').height;
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var _this;

export default class SearchAddress extends React.Component {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
    this.onLeftBack = this.onLeftBack.bind(this);
    _this = this;
  }

  componentWillReceiveProps(nextProps) {
    const {address} = nextProps;
    if(address.addressFetched) {
      nextProps.dispatch(stopHandleTimeConsuming());
      if(address.error) {
        showAlert(address.error);
      }
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    let addressData = [];
    dispatch(assignAddressListData(addressData));
  }

  renderDetail(rowData) {
    return (
      <View style={styles.card}>
        <View style={styles.userInfo}>
          <Image style={styles.avatar} source={require('../img/icon/icon-avatar.png')}/>
          <Text style={styles.detailText}>{rowData.displayName}</Text>
        </View>
        <View style={styles.detail}>
          <View style={styles.row}>
            <Text style={styles.detailText}>电话: {rowData.mobile}</Text>
            {rowData.mobile !== undefined && rowData.mobile.length > 0 && _this.renderTelephoneIcon(rowData.mobile)}
          </View>
          <Text style={styles.detailText}>邮箱: {rowData.email}</Text>
          <Text style={styles.detailText}>所属公司: {rowData.compayName}</Text>
        </View>
      </View>
    );
  }

  renderTelephoneIcon(phoneNum) {
    return(
      <TouchableOpacity onPress={()=> _this.onCall(phoneNum)}>
        <Image style={{height: 24, width: 24,}} source={require('../img/icon/telephone.png')}/>
      </TouchableOpacity>
    )
  }

  renderListView() {
    const {address} = this.props;
    if(address.searchUserData._cachedRowCount <= 0) {
      return (
        <View style={{height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../img/icon/app_panel_expression_icon.png')} style={{width: 120, height: 120,}}/>
          <Text style={{textAlign:'center', fontSize: 15, color: Colors.grey,}}>当前没有搜索结果～</Text>
        </View>
      )
    } else {
      return (
        <ListView
          dataSource={address.searchUserData}
          renderRow={this.renderDetail}
        />
      )
    }
  }

  render() {
    const {dispatch, address} = this.props;
    const dismissKeyboard = require('dismissKeyboard');
    return (
      <View style={styles.container}>
        <NavigationBar title={'通讯录'} titleColor={Colors.white}
          leftButtonIcon={require('../img/office/icon-backs.png')}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack} />
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
          <View style={{flexDirection: 'row',height: 56}}>
            <TextInput
              style={{flex: 1,height:32,margin: 8, elevation: 3,borderRadius: 2,backgroundColor: 'white',fontSize: 14}}
              placeholder='请输入姓名查找'
              onChangeText={(searchName)=>dispatch(changeSearchName(searchName))}
              returnKeyType={'search'}
              onSubmitEditing={this.onSearch} />
            <TouchableOpacity onPress={this.onSearch}
              style={{ height:32,width:64,margin: 8,elevation: 3,borderRadius: 2,alignItems: 'center',justifyContent: 'center',backgroundColor: Colors.mainColor}}>
              <Text>搜索</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.main}>
          {this.renderListView()}
        </View>
        <View>
          <Spinner visible={address.addressFetching} text={'搜索中,请稍后...'}/>
        </View>
      </View>
    );
  }

  onSearch() {
    const {dispatch, address} = this.props;
    if(!address.searchName || !address.searchName.trim() || address.searchName.trim().length <= 0) {
      Alert.alert('错误提示:','搜索内容不能为空!',[{text: '好'},]);
      return;
    }
    dispatch(fetchAddressSearch(address.searchName.LTrim().RTrim()));
    dispatch(startHandleTimeConsuming());
  }

  onLeftBack() {
    const {navigator} = this.props;
    navigator.pop();
  }

  onCall(phoneNum){
    let url ;
    if(Platform.OS !== 'android') {
      url = 'telprompt:' + phoneNum;
    } else {
      url = 'tel:' + phoneNum;
    }
    Linking.openURL(url);
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackground
  },

  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#ccc',
    margin: 8,
    elevation: 1,
    padding: 8,
  },
  userInfo: {
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    alignSelf: 'center',
  },
  detail: {
    marginLeft: 16,
  },
  detailText: {
    marginTop:5,
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
  }
});
