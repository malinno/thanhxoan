import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import NetworkLogger from 'react-native-network-logger';

interface IProps {}

const LoggerScreen: FC<IProps> = () => {
  return (
    <>
      <Header title="Network Logger" />
      <View style={styles.container}>
        <NetworkLogger theme="light" />
      </View>
    </>
  );
};

export default LoggerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
