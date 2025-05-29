import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React, { FC, memo } from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Text from '../Text';
import { Option } from './SelectPicker.interface';
import styles from './styles';
import images from '@images';

interface Props extends PressableProps {
  option: Option;
  onPress: () => void;
  separator?: boolean;
  active?: boolean;
  isSelected?: boolean;
}

const SelectOptionItem: FC<Props> = memo(
  ({ option, onPress, separator, active, style, isSelected, ...props }) => {
    const { text, leftIcon, leftIconStyle, rightIcon, rightIconStyle } = option;
    return (
      <Pressable
        style={[
          styles.optionItem,
          style as StyleProp<ViewStyle>,
          separator && styles.separator,
        ]}
        onPress={onPress}>
        {!isNil(leftIcon) && (
          <Image source={leftIcon} style={[styles.optionIcon, leftIconStyle]} />
        )}
        <Text
          style={[
            styles.optionText,
            { color: active ? colors.primary : colors.color161616 },
          ]}>
          {text}
        </Text>
        {!isNil(rightIcon) && (
          <Image
            source={rightIcon}
            style={[styles.optionIcon, rightIconStyle]}
          />
        )}
        {isSelected && (
          <Image source={images.common.check} tintColor={colors.primary} />
        )}
      </Pressable>
    );
  },
);

SelectOptionItem.defaultProps = {
  separator: true,
};

export default SelectOptionItem;
