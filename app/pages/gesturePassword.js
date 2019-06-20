'use strict'

import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Alert,
    InteractionManager,
} from 'react-native';
import PasswordGesture from '../lib/react-native-gesture-password';
import global from '../utils/GlobalStorage';
import {changeLoginAuth} from '../actions/login';
import {connect} from 'react-redux';
import TaskListContainer from '../containers/TaskListContainer';
import {TASKLIST_URL} from '../constants/Network';
import LoginContainer from '../containers/LoginContainer';
let setCache = ''; //设置缓存
let password = ''; //密码

class GesturePassword extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message: '请绘制解锁图案',
            status: 'normal'
        };
        setCache='';
    }

    render() {
         return (
             <PasswordGesture
                 ref='pg'
                 status={this.state.status}
                 message={this.state.message}
                 interval={500}
                 onStart={() => this.onStart()}
                 onEnd={(input) => this.onEnd(input)}
                 children = {this._renderChilder()}
                 />
         );
     }

    _renderChilder() {
        return (

            <TouchableOpacity style={{position: 'absolute',bottom: 24,right:16}}
                onPress={()=>{Alert.alert('提示','忘记手势密码需要重新登录,确定要清空手势密码吗?',[{text: '确定',onPress: ()=>{this._clearGesturePassword()}},{text: '取消',onPress: ()=>{}}])}}>
                <Text style={{color: '#fff'}}>忘记手势密码</Text>
            </TouchableOpacity>

        );
    }

    componentWillUnmount(){
      setCache ='';
    }

    _clearGesturePassword() {
      const {navigator, dispatch} = this.props;
      dispatch(changeLoginAuth({username: '', password: ''}));
        setCache = '';
        password = '';
        global.storage.save({
            key: 'gesture',
            rawData: {
                gesture: '',
            },
        });
        global.storage.save({
            key: 'userName',
            rawData: {
           },
        });
        InteractionManager.runAfterInteractions(() => {
          navigator.resetTo({
            component: LoginContainer,
            name: 'Login'
          });
        });
    }

    componentDidMount() {
      const dismissKeyboard = require('dismissKeyboard');
      dismissKeyboard();
        global.storage.load({
            key: 'gesture',
        }).then((ret)=>{
            if(!ret.gesture && ret.gesture === ''){
                password = '';
            }else{
                password = ret.gesture;
                this.setState({
                    status: 'normal',
                    message: '请输入你的密码!'
                });
            }
        }).catch((err)=>{
            console.log('error==>',err);
            password = '';
        })
    }

    onEnd(input) {
        if(password === '' ){
            // TODO 设置密码
            if(setCache === ''){
                //初始设置
                if(input.length < 4){
                    this.setState({
                        status: 'normal',
                        message: '至少连接4个点,请重新绘制!'
                    });
                } else {
                    setCache = input;
                    this.setState({
                        status: 'normal',
                        message: '请再次绘制解锁图案!'
                    });
                }
            } else {
                //确认手势密码
                if(setCache === input) {
                    global.storage.save({
                        key: 'gesture',
                        rawData: {
                            gesture: input,
                        },
                    });
                    this.setState({
                        status: 'normal',
                        message: '手势密码设置成功!请进行解锁!'
                    });
                    password = input;
                }else {
                    this.setState({
                        status: 'normal',
                        message: '两次密码不一样,请重新输入!'
                    });
                }
            }
        }else{ //
            if (password === input ) {
              const {route, navigator} = this.props;
                //解锁
                this.setState({
                    status: 'right',
                    message: '密码成功!'
                });
                if(route.type == 'notice'){
                  navigator.replace({
                    name: "TaskListContainer",
                    component: TaskListContainer,
                    url: TASKLIST_URL,
                    navBarTitle: "待办",});
                } else {
                  navigator.pop();
                }
                // your codes to close this view
            } else {
                this.setState({
                    status: 'wrong',
                    message:  '密码错误,请重新输入!'
                });
            }
        }
    }

    onStart() {
      // console.log('onStart');
        // this.setState({
        //     status: 'normal',
        //     message: '请输入你的密码!'
        // });
    }

    onReset() {
        // console.log('onReset');
        // this.setState({
        //     status: 'normal',
        //     message: '请再次输入你的密码!'
        // });
    }
}
function mapStateToProps(state) {
  const { login} = state;
  return {
    login,
  }
}
export default connect(mapStateToProps)(GesturePassword);
