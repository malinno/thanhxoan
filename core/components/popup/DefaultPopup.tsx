import React from 'react';
import {StyleSheet, View} from 'react-native';

export interface DefaultPopupProps {}

const DefaultPopup = () => {
  return <View style={styles.container}></View>;
};

export default DefaultPopup;

const styles = StyleSheet.create({
  container: {},
});
