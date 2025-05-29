import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

interface IProps extends TouchableOpacityProps {
  icon: ImageSourcePropType;
  colors?: string[];
  style?: StyleProp<ViewStyle>;
}

class CircularButton extends React.Component<IProps> {
  render() {
    const { icon, style, colors: mColors, ...rest } = this.props;
    return (
      <Touchable style={[styles.container, style]} {...rest}>
        <Image source={icon} />
      </Touchable>
    );
  }
}

export const AnimatedCircularButton =
  Animated.createAnimatedComponent(CircularButton);

export default CircularButton;

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
});
