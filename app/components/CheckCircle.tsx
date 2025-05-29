import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

type Props = ViewProps & {
  isSelected?: boolean;
};

const CheckCircle: FC<Props> = ({ isSelected, style, ...props }) => {
  return (
    <View
      style={[
        styles.circle,
        isSelected && { backgroundColor: colors.primary },
        style,
      ]}>
      <Image
        style={styles.checkIcon}
        source={images.common.check}
        resizeMode="contain"
      />
    </View>
  );
};

export default CheckCircle;

const styles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.color22222226,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [
      {
        translateX: 10,
      },
      {
        translateY: 10,
      },
    ],
  },
  checkIcon: {
    transform: [
      {
        translateX: -4,
      },
      {
        translateY: -4,
      },
    ],
  },
});
