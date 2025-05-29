import { colors } from '@core/constants/colors.constant';
import { isArray, isNil, pick } from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Layout } from 'react-native-reanimated';
import { AnimatedText } from './Text';
import { AnimatedTouchable } from './Touchable';
import HStack from '@app/components/HStack';

export interface ButtonIcon {
  src: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
}

export interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  colors?: string | string[];
  leftIcon?: ButtonIcon;
  rightIcon?: ButtonIcon;
  disabledColors?: string;
  disabledTextColor?: string;
}

class Button extends React.PureComponent<ButtonProps> {
  render(): React.ReactNode {
    const {
      text,
      style,
      textStyle,
      loading,
      leftIcon,
      rightIcon,
      disabledColors,
      disabledTextColor,
      ...rest
    } = this.props;
    
    if (this.props.loading) rest.disabled = true;

    let mColors = this.props.colors;
    if (!mColors) mColors = [colors.primary, colors.primary];
    if (!isArray(mColors)) mColors = [mColors, mColors];
    else if (mColors?.length === 1) mColors = mColors.concat(mColors);
    if (this.props.disabled)
      mColors = disabledColors
        ? [disabledColors, disabledColors]
        : [colors.colorB2B2B2, colors.colorB2B2B2];

    const indicatorColor =
      textStyle && StyleSheet.flatten(textStyle).color
        ? StyleSheet.flatten(textStyle).color
        : colors.white;

    const background = [
      pick(StyleSheet.flatten([styles.button, style]), ['borderRadius']),
      styles.background,
    ];

    return (
      <AnimatedTouchable
        layout={Layout.springify().damping(15)}
        style={[styles.button, style]}
        {...rest}>
        <LinearGradient colors={mColors} style={background} />
        <HStack
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          {!isNil(leftIcon) && (
            <Image
              source={leftIcon.src}
              style={[styles.icon, leftIcon.style]}
              resizeMode="contain"
            />
          )}
          <AnimatedText
            style={[
              styles.text,
              textStyle,
              this.props.disabled && disabledTextColor
                ? { color: disabledTextColor }
                : {},
            ]}>
            {text}
          </AnimatedText>
          {!isNil(rightIcon) && (
            <Image
              source={rightIcon.src}
              style={[styles.icon, rightIcon.style]}
              resizeMode="contain"
            />
          )}
          {!!loading && (
            <ActivityIndicator
              size="small"
              style={styles.loading}
              color={indicatorColor}
            />
          )}
        </HStack>
      </AnimatedTouchable>
    );
  }
}

export const AnimatedButton = Animated.createAnimatedComponent(Button);

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    minHeight: 50,
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  icon: {},
  text: {
    // flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
  },
  loading: {
    // marginLeft: 12,
    // position: 'absolute',
    // right: 24,
  },
});
