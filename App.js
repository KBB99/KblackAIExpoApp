import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {Camera, Permissions} from 'expo';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './src/HomeScreen';

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
})

const MainApp = createAppContainer(AppNavigator)

export default MainApp
