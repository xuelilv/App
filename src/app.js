import React, { Component } from 'react';
import {
  WebView,
  Image,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  BackHandler
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';

class Face extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let styles = StyleSheet.create({
      bg: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        width: '100%',
        height: '100%'
      }
    });
    return (
      <Image source={require('./assets/images/bg.jpg')} 
      style={styles.bg}/>
    );
  }

  componentDidMount() {
    const {navigate} = this.props.navigation;
    this.timer = setTimeout(
      () => {
        navigate('Index');
    },1500);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
}

class Btn extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    let styles = StyleSheet.create({
      button: {
        height: 48,
        width: '90%',
        borderRadius: 6,
        backgroundColor: '#0084ff',
        justifyContent: 'center',
        margin: '5%',
      },
      buttonText: {
          textAlign: 'center',
          color: 'white',
      }
    });

    return (
      <TouchableOpacity
        onPress={this.onButtonPress.bind(this)}
        style={styles.button}>
        <Text style={styles.buttonText}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }

  onButtonPress(type) {
    this.props.navigation.navigate('MyWebView', {url: this.props.url});
  }
}

class Index extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let styles = StyleSheet.create({
      button: {
        height: 48,
        width: '90%',
        borderRadius: 6,
        backgroundColor: '#0084ff',
        justifyContent: 'center',
        margin: '5%',
      },
      buttonText: {
          textAlign: 'center',
          color: 'white',
      }
    });

    return (
      <View>
        <Btn url='md' title='美的电风扇' navigation={this.props.navigation} />
        <Btn url='airmate' title='自定义折线图' navigation={this.props.navigation} />
        <Btn url='water' title='滴滴山泉' navigation={this.props.navigation} />
      </View>
    );
  }
}

class MyWebView extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    let type = this.props.navigation.state.params.url;
    let url = '';
    if(type === 'md') {
      url = 'file:///android_asset/T0xFA/controlPanel.html';
    }else if(type === 'airmate') {
      url = 'file:///android_asset/airmate/index.html';
    }else if(type === 'water') {
      url = 'https://doll-preproduction.allpaycloud.cn/management_sys/water/index.html#control';
    }
    
    return (
      <WebView 
          ref='webViewRef'
          source={{uri: url, headers: {'Access-Control-Allow-Origin': '*'}}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onMessage={this.onMessage.bind(this)}
      />
    );
  }

  onMessage(e) {
    var data = e.nativeEvent.data;
    if(data === 'goBack') {
      this.props.navigation.goBack();
    }
  }

}

const Navigator = StackNavigator({
  Face: {screen: Face},
  Index: {screen: Index},
  MyWebView: {screen: MyWebView}
});

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Navigator />
    );
  }
}

