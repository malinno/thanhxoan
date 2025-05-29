import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type QtyAdjustmentRef = {
  getValue: () => string;
};

type Props = ViewProps & {
  min?: number;
  max?: number;
  value?: string;
  onChangeText?: (value: string) => void;
  editable?: boolean;
  disabled?: boolean;
  inputContainerStyle?: StyleProp<ViewStyle>;
};

const QuantityAdjustment = forwardRef<QtyAdjustmentRef, Props>(
  (
    {
      min,
      max,
      onChangeText,
      editable,
      disabled,
      style,
      inputContainerStyle,
      ...props
    },
    ref,
  ) => {
    const _inputRef = useRef<TextInput>(null);

    const [value, setValue] = useState(String(props.value || ''));

    useImperativeHandle(ref, () => ({
      getValue: () => {
        return value;
      },
    }));

    useEffect(() => {
      const newValue = String(props.value);
      setValue(newValue);
    }, [props.value]);

    const _onPressAdd = () => {
      Keyboard.dismiss();
      onEdit(String(Math.min(Number(value) + 1, max || Infinity)));
    };

    const _onPressSub = () => {
      Keyboard.dismiss();
      onEdit(String(Math.max(Number(value) - 1, 0)));
    };

    const onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onEdit(event.nativeEvent.text);
    };

    const onEndEditing = (
      event: NativeSyntheticEvent<TextInputEndEditingEventData>,
    ) => {
      onEdit(event.nativeEvent.text);
    };

    const onEdit = (text?: string) => {
      if (!text) return;

      const formatted =
        Math.round(parseFloat(text.replace(/,/g, '.')) * 100) / 100;
      let quantity = isNaN(formatted) ? 0 : formatted;
      quantity = Math.max(Math.min(quantity, max || Infinity), min || 0);
      onChangeText?.(String(quantity));
      // _inputRef.current?.setNativeProps({ text: String(quantity) });
    };

    const _onPressInput = () => {
      _inputRef.current?.focus();
    };

    const disableSub = value === String(min || 0);
    const disableAdd = !isNil(max) && value === String(max);

    return (
      <View style={[styles.quantityAdjust, style]}>
        {!disabled && (
          <TouchableOpacity
            style={[
              styles.adjustBtn,
              disableSub && { backgroundColor: undefined },
            ]}
            onPress={_onPressSub}
            disabled={disableSub}>
            <Text
              style={[
                styles.adjustText,
                disableSub && { color: colors.color161616 },
              ]}>
              -
            </Text>
          </TouchableOpacity>
        )}
        <Pressable
          onPress={_onPressInput}
          style={[styles.quantityContainer, inputContainerStyle]}>
          <TextInput
            ref={_inputRef}
            style={styles.quantity}
            onBlur={onBlur}
            onEndEditing={onEndEditing}
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
            editable={editable && !disabled}
          />
        </Pressable>
        {!disabled && (
          <TouchableOpacity
            style={[
              styles.adjustBtn,
              disableAdd && { backgroundColor: undefined },
            ]}
            onPress={_onPressAdd}
            disabled={disableAdd}>
            <Text style={styles.adjustText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

QuantityAdjustment.defaultProps = {
  min: 0,
  editable: true,
};

export default QuantityAdjustment;

const styles = StyleSheet.create({
  quantityAdjust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adjustBtn: {
    width: 25,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.colorB8B8B857,
    backgroundColor: colors.color2651E51A,
  },
  adjustText: {
    color: colors.color2651E5,
  },
  quantityContainer: {
    minWidth: 52,
    height: 42,
    borderWidth: 1,
    borderColor: colors.colorB8B8B857,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.color161616,
    textAlign: 'center',
    padding: 0,
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.color161616,
    marginTop: 4,
  },
});
