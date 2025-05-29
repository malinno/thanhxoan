import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import LayoutUtils from '@core/utils/LayoutUtils';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextProps,
} from 'react-native';

interface SectionRowIcon {
  src: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
}

interface ISectionRowProps extends TouchableProps {
  title?: string | number | React.ReactNode;
  titleProps?: TextProps;
  text?: string | number;
  textProps?: TextProps;
  leftIcons?: SectionRowIcon[];
  rightIcons?: SectionRowIcon[];
  renderText?: (text: string | number) => React.ReactElement | null;
  renderTitle?: (title: string) => React.ReactElement | null;
}

const SectionRow: React.FunctionComponent<ISectionRowProps> = props => {
  const {
    title,
    titleProps,
    text,
    textProps,
    style,
    leftIcons,
    rightIcons,
    ...rest
  } = props;
  const { style: titleStyle, ...titleRest } = titleProps || {};
  const { style: textStyle, ...textRest } = textProps || {};

  const _renderTitle = () => {
    if (!title && !props.renderTitle) return;

    if (props.renderTitle) {
      return props.renderTitle(title ? String(title) : '');
    }
    return (
      <Text style={[styles.title, titleStyle]} {...titleRest}>
        {title}
      </Text>
    );
  };

  const _renderText = () => {
    if (!text && !props.renderText) return;

    if (props.renderText) {
      return props.renderText(text ?? '');
    }
    return (
      <Text style={[styles.text, textStyle]} selectable {...textRest}>
        {text}
      </Text>
    );
  };

  return (
    <Touchable disabled={!props.onPress} style={[styles.row, style]} {...rest}>
      {leftIcons?.map((item, index) => {
        return (
          <Image
            key={index}
            source={item.src}
            style={[styles.leftIcon, item.style]}
          />
        );
      })}
      {_renderTitle()}
      {_renderText()}
      {rightIcons?.map((item, index) => {
        return (
          <Image
            key={index}
            source={item.src}
            style={[styles.rightIcon, item.style]}
          />
        );
      })}
    </Touchable>
  );
};

export default SectionRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '500',
    color: colors.color161616,
  },
  text: {
    maxWidth: LayoutUtils.size(180),
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.color161616,
    textAlign: 'right',
  },
  leftIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  rightIcon: {
    marginLeft: 8,
    marginTop: 2,
  },
});
