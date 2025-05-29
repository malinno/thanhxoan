import { colors } from '@core/constants/colors.constant';
import { DEFAULT_FONTSIZE } from '@core/constants/fonts.constant';
import getFontFamily from '@core/utils/getFontFamily';
import { omit } from 'lodash';
import * as React from 'react';
import {
  Animated as RNAnimated,
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import ParsedText, { ParsedTextProps } from 'react-native-parsed-text';
import Animated from 'react-native-reanimated';

export interface TextProps extends RNTextProps, ParsedTextProps {}

const Text: React.FunctionComponent<TextProps> = ({ children, ...props }) => {
  const oStyle: StyleProp<TextStyle> = StyleSheet.flatten([
    { color: colors.color161616 },
    props.style,
  ]);
  const fontSize = oStyle?.fontSize || DEFAULT_FONTSIZE;
  const mStyle = StyleSheet.flatten([
    omit(oStyle, 'fontWeight', 'fontStyle', 'fontSize'),
    {
      fontFamily: getFontFamily('BeVietnamPro', oStyle),
      fontSize,
      includeFontPadding: false,
    },
  ]);
  if (props.parse)
    return (
      <ParsedText {...props} style={mStyle}>
        {children}
      </ParsedText>
    );

  return (
    <RNText {...props} style={mStyle}>
      {children}
    </RNText>
  );
};

Text.defaultProps = {
  allowFontScaling: false,
};

class TextComponent extends React.Component<TextProps> {
  constructor(props: TextProps) {
    super(props);
  }

  render(): React.ReactNode {
    return <Text {...this.props} />;
  }
}

export const RNAnimatedText = RNAnimated.createAnimatedComponent(TextComponent);
export const AnimatedText = Animated.createAnimatedComponent(TextComponent);

export default Text;
