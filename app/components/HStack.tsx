import { StyleSheet, View, ViewProps } from 'react-native';
import React, { FC } from 'react';
import Touchable, { AnimatedTouchable, TouchableProps } from '@core/components/Touchable';
import { AnimatedProps } from 'react-native-reanimated';

interface Props extends AnimatedProps<TouchableProps> {}

const HStack: FC<Props> = ({ children, style, ...props }) => {
  return (
    <AnimatedTouchable
      activeOpacity={1}
      disabled={!props.onPress}
      style={[styles.container, style]}
      {...props}>
      {children}
    </AnimatedTouchable>
  );
};

export default HStack;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
