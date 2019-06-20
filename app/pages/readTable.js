'use strict'

import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';

import Colors from '../constants/Colors';
import NavigationBar from '../components/ZqOfficeNavigationBar';
var cellHigh = 48;
var cellWide = 112;
var wordSize = 17;
var WIDTH = Dimensions.get('window').width;
export default class ReadTableView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tableData:  {titleVo:[],data:[]},
      wordSize:wordSize,
      circleStyles:{
        cell: {
          borderWidth: 1,
          width: cellWide,
          height: cellHigh,
          borderColor: '#999',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }
      },
    };
  }

  componentWillMount(){
    this.setState({
      tableData: this.props.route.tableData ,
    });

  }
  componentWillUnmount()
  {
    cellHigh = 48;
    cellWide = 112;
    wordSize = 17;
  }
  onLeftBack(){
    this.props.navigator.pop();
  }

  onSum(key){
    let sum = 0;
    this.state.tableData.data.map((rowData)=>{
      if(rowData[key] != undefined && rowData[key] != ''){
        sum += parseFloat(rowData[key])
      }
    });
    sum = sum.toFixed(3);
    Alert.alert('',`${key}合计:${sum}`,[
      {
        text: '确定',
      }
    ]);
  }
  sizeChangeToSmaller()
  {
    this.refs.scrollview.scrollTo({x: 0, y: 0});
    if (this.state.circleStyles.cell.width*this.state.tableData.titleVo.length > WIDTH) {
      cellWide*=5/6;
      cellHigh*=5/6;
      wordSize*=5/6;
      this.setState({
        wordSize:wordSize,
        circleStyles:{
          cell: {
            borderWidth: 1,
            width: cellWide,
            height: cellHigh,
            borderColor: '#999',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }
        }
      })
    }
  }
 sizeChangeToBigger()
 {
   if (this.state.wordSize < 50) {
      cellWide*=6/5;
      cellHigh*=6/5;
      wordSize*=6/5;
     this.setState({
       wordSize:wordSize,
       circleStyles:{
         cell: {
           borderWidth: 1,
           width: cellWide,
           height: cellHigh,
           borderColor: '#999',
           alignItems: 'center',
           justifyContent: 'center',
           overflow: 'hidden',
         }
       }
     })
   }

 }
  render() {
    var titleName = this.state.tableData.code? this.state.tableData.code: '';
    var titleLine = this.state.tableData.titleVo.map((rowData)=>{
      if(rowData.type && rowData.type === 'int'){
        return (
          <View style={this.state.circleStyles.cell}>
            <TouchableOpacity onPress={this.onSum.bind(this,rowData.title)}>
              <Text style={{color: Colors.mainColor,fontSize:this.state.wordSize}}>{rowData.title}</Text>
            </TouchableOpacity>
          </View>
        );
      }else{
        return (
          <View style={this.state.circleStyles.cell}>
            <Text style={{fontSize:this.state.wordSize}}>{rowData.title}</Text>
          </View>
        );
      }
    });

    var bodyLine = this.state.tableData.data.map((rowData)=>{
      var item = this.state.tableData.titleVo.map((row)=>{
        let key = row.title;
        let value = rowData[key] ? rowData[key] : '';
        return (
          <TouchableOpacity onPress={()=>{
            Alert.alert('',`${key} \n ${value}`,[{text: '确定', onPress: ()=>{},}]);
          }}>
            <View style={this.state.circleStyles.cell}>
              <Text numberOfLines = {2} style={{fontSize:this.state.wordSize}}>{rowData[key]}</Text>
            </View>
          </TouchableOpacity>
        );
      });
      return(
        <View style={{flexDirection: 'row'}}>
          {item}
        </View>
      );
    });

    return(
      <View style={styles.background}>
        <NavigationBar
          title={titleName} titleColor={Colors.white}
          backgroundColor={Colors.mainColor} onLeftButtonPress={this.onLeftBack.bind(this)}
          leftButtonIcon={require('../img/office/icon-backs.png')}/>
          <ScrollView ref={'scrollview'}>
          <ScrollView horizontal={true}>
            <View
            style={this.state.circleStyles.style}>
              <View style={{flexDirection: 'row'}}>
                {titleLine}
              </View>
              {bodyLine}
            </View>
            </ScrollView>
            </ScrollView>
          <TouchableOpacity style={{width: 56,height: 56,borderRadius: 28,backgroundColor: Colors.mainColor,position: 'absolute',bottom: 10,right: 80,elevation: 4,justifyContent: 'center',alignItems: 'center'}}
            onPress={this.sizeChangeToSmaller.bind(this)}>
            <Image style={{width: 32,height: 32}} source={require('../img/icon/zoom_out.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={{width: 56,height: 56,borderRadius: 28,backgroundColor: Colors.mainColor,position: 'absolute',bottom: 10,right: 10,elevation: 4,justifyContent: 'center',alignItems: 'center'}}
            onPress={this.sizeChangeToBigger.bind(this)}>
            <Image style={{width: 32,height: 32}} source={require('../img/icon/zoom_in.png')}/>
          </TouchableOpacity>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
});
