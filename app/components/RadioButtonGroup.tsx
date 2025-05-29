import Text, { AnimatedText } from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import RNBounceable from '@freakycoder/react-native-bounceable';
import { isNil } from 'lodash';
import React, { FC, useCallback } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type IRadioButton = {
  id: number | string;
  text: string;
  color?: string;
  outerStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
};

export interface IRadioButtonProps {
  id: number | string;
  text: string;
  isActive: boolean;
  innerBackgroundColor?: string;
  innerContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

export interface IRadioButtonGroupProps extends ViewProps {
  value?: number | string;
  horizontal?: boolean;
  data: Array<IRadioButton>;
  onChange?: (selectedItem: IRadioButton) => void;
  editable?: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  required?: boolean;
  itemOuterStyle?: StyleProp<ViewStyle>;
  itemGap?: number;
}

const RadioButton: FC<IRadioButtonProps> = ({
  id,
  text,
  isActive,
  innerBackgroundColor,
  innerContainerStyle,
  style,
  onPress,
  disabled = false,
  ...props
}) => {
  const _onPress = () => onPress?.();
  const Comp = disabled ? View : RNBounceable;
  return (
    <Comp style={[styles.item, style]} onPress={_onPress}>
      <View
        style={[
          styles.outer,
          { borderColor: isActive ? colors.primary : colors.color7E8CA0 },
        ]}>
        <View
          style={[styles.inner, isActive ? { opacity: 1 } : { opacity: 0 }]}
        />
      </View>
      <AnimatedText style={styles.text}>{text}</AnimatedText>
    </Comp>
  );
};

const RadioButtonGroup: FC<IRadioButtonGroupProps> = ({
  value,
  horizontal = false,
  editable = true,
  data,
  onChange,
  style,
  title,
  titleStyle,
  required,
  itemOuterStyle,
  itemGap,
  ...props
}) => {
  const containerStyle = useCallback(
    (horizontal: boolean): ViewStyle => ({
      flexDirection: horizontal ? 'row' : 'column',
      gap: !isNil(itemGap) ? itemGap : horizontal ? 12 : 8,
    }),
    [],
  );

  return (
    <View style={[styles.container, style]} {...props}>
      {!!title && (
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {Boolean(required) && <Text style={styles.required}>* </Text>}
          {title}
        </Text>
      )}

      <View style={[containerStyle(horizontal)]}>
        {data?.map((item, index) => {
          const _isActive = item.id === value;

          const _onPress = () => {
            if (!editable) return;
            // setSelectedOptionId(item.id);
            onChange?.(item);
          };

          return (
            <RadioButton
              key={item.id}
              {...item}
              isActive={_isActive}
              innerBackgroundColor={item.color}
              innerContainerStyle={item.innerStyle}
              style={StyleSheet.flatten([item.outerStyle, itemOuterStyle])}
              onPress={_onPress}
              disabled={editable === false}
            />
          );
        })}
      </View>
    </View>
  );
};

export default RadioButtonGroup;

const styles = StyleSheet.create({
  container: {},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  required: {
    color: colors.colorFB4646,
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.color6B7A90,
  },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  text: {},
});
