import React from 'react';
import { StatusBar, YellowBox } from 'react-native'; //A barra superior de td (hrs, bateria...)

import Routes from './src/routes';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']); //Isso é pra ignorar um erro do websocket

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7d40e7"/>
      <Routes />
    </>
  );
}

