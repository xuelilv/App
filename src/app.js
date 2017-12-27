import React, { Component } from 'react';
import {
  WebView
} from 'react-native';

export default class App extends Component {
  render() {
    return (
      <WebView 
          ref='webViewRef'
          source={require('./app.html')}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
      />
    );
  }
}
