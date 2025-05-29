import Text, { AnimatedText } from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { isEmpty, isNil, isNaN } from 'lodash';
import React, {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export interface InputNumberRef {
  focus: Function;
}

interface InputButtonProps {
  text?: string;
  icon?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

interface InputNumberProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  title: string | JSX.Element;
  titleStyle?: StyleProp<TextStyle>;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  error?: string | JSX.Element;
  leftButtons?: InputButtonProps[];
  rightButtons?: InputButtonProps[];
  disabled?: boolean;
  suffix?: React.ReactNode;
  renderContent?: React.ReactNode;
  hideErrorText?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  value?: number;
  onChangeText?: (value: number) => void;
  decimalPlaces?: number; // Số chữ số thập phân
  min?: number; // Giá trị tối thiểu
  max?: number; // Giá trị tối đa
  allowNegative?: boolean; // Cho phép giá trị âm
  thousandSeparator?: string; // Dấu phân cách hàng nghìn
  decimalSeparator?: string; // Dấu phân cách thập phân
}

const InputNumber = forwardRef<InputNumberRef, InputNumberProps>((props, ref) => {
  const {
    title,
    titleStyle,
    required,
    style,
    onPress,
    error,
    leftButtons,
    rightButtons,
    disabled,
    suffix,
    renderContent,
    hideErrorText,
    inputStyle,
    value,
    onChangeText,
    decimalPlaces = 0,
    min,
    max,
    allowNegative = false,
    thousandSeparator = ',',
    decimalSeparator = '.',
    ...rest
  } = props;

  // Lưu giá trị hiển thị dưới dạng chuỗi
  const [displayValue, setDisplayValue] = useState<string>(
    formatNumberToString(value, decimalPlaces, thousandSeparator, decimalSeparator)
  );
  
  // Cập nhật displayValue khi value thay đổi từ bên ngoài
  React.useEffect(() => {
    setDisplayValue(formatNumberToString(value, decimalPlaces, thousandSeparator, decimalSeparator));
  }, [value, decimalPlaces, thousandSeparator, decimalSeparator]);

  const editable = props.editable && !disabled;
  const _ref = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      _ref.current?.focus();
    },
  }));

  // Hàm định dạng số thành chuỗi hiển thị
  function formatNumberToString(
    num?: number, 
    decimals: number = 0, 
    thouSep: string = ',', 
    decSep: string = '.'
  ): string {
    if (num === undefined || num === null || isNaN(num)) return '';
    
    // Làm tròn số đến số chữ số thập phân cần thiết
    const fixedNum = decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
    
    // Tách phần nguyên và phần thập phân
    const parts = fixedNum.split('.');
    
    // Định dạng phần nguyên với dấu phân cách hàng nghìn
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thouSep);
    
    // Kết hợp lại với dấu phân cách thập phân
    return parts.length > 1 ? parts.join(decSep) : parts[0];
  }

  // Hàm chuyển đổi chuỗi hiển thị thành số
  function parseStringToNumber(str: string): number {
    if (!str) return 0;
    
    // Loại bỏ tất cả các dấu phân cách hàng nghìn
    const withoutThousandSep = str.replace(new RegExp('\\' + thousandSeparator, 'g'), '');
    
    // Thay thế dấu phân cách thập phân bằng dấu chấm để parse
    const normalized = withoutThousandSep.replace(new RegExp('\\' + decimalSeparator, 'g'), '.');
    
    // Parse thành số
    const num = parseFloat(normalized);
    
    // Kiểm tra giá trị hợp lệ
    if (isNaN(num)) return 0;
    
    // Kiểm tra giới hạn
    let result = num;
    if (min !== undefined && result < min) result = min;
    if (max !== undefined && result > max) result = max;
    if (!allowNegative && result < 0) result = 0;
    
    return result;
  }

  // Xử lý khi giá trị thay đổi
  const handleChangeText = (text: string) => {
    // Nếu text rỗng, cho phép và trả về 0
    if (!text) {
      setDisplayValue('');
      if (onChangeText) {
        onChangeText(0);
      }
      return;
    }
    
    // Chỉ cho phép nhập số, dấu phân cách hàng nghìn, dấu phân cách thập phân và dấu âm ở đầu
    const validChars = allowNegative ? `-0123456789${thousandSeparator}${decimalSeparator}` : `0123456789${thousandSeparator}${decimalSeparator}`;
    
    // Kiểm tra xem text có chứa ký tự không hợp lệ không
    let isValid = true;
    for (let i = 0; i < text.length; i++) {
      if (!validChars.includes(text[i]) || (text[i] === '-' && i !== 0)) {
        isValid = false;
        break;
      }
    }
    
    // Nếu có ký tự không hợp lệ, không cập nhật giá trị
    if (!isValid) return;
    
    // Chuyển đổi thành số để kiểm tra giới hạn
    const numValue = parseStringToNumber(text);
    
    // Kiểm tra giới hạn max ngay khi nhập
    if (max !== undefined && numValue > max) {
      // Nếu vượt quá max, đặt giá trị là max
      const maxFormatted = formatNumberToString(max, decimalPlaces, thousandSeparator, decimalSeparator);
      setDisplayValue(maxFormatted);
      if (onChangeText) {
        onChangeText(max);
      }
      return;
    }
    
    // Kiểm tra giới hạn min ngay khi nhập
    if (min !== undefined && numValue < min && text !== '-') {
      // Nếu nhỏ hơn min (và không phải đang nhập dấu trừ), đặt giá trị là min
      const minFormatted = formatNumberToString(min, decimalPlaces, thousandSeparator, decimalSeparator);
      setDisplayValue(minFormatted);
      if (onChangeText) {
        onChangeText(min);
      }
      return;
    }
    
    // Cập nhật giá trị hiển thị
    setDisplayValue(text);
    
    // Gọi callback với giá trị đã kiểm tra
    if (onChangeText) {
      onChangeText(numValue);
    }
  };

  // Xử lý khi focus ra khỏi input
  const handleBlur = (e: any) => {
    // Định dạng lại giá trị hiển thị khi blur
    const numValue = parseStringToNumber(displayValue);
    setDisplayValue(formatNumberToString(numValue, decimalPlaces, thousandSeparator, decimalSeparator));
    
    // Gọi props.onBlur nếu có
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const _onPress = () => {
    onPress?.() || _ref.current?.focus();
  };

  const _renderSuffix = () => {
    if (!suffix) return;
    switch (typeof suffix) {
      case 'string':
        return <Text style={styles.suffix}>{suffix}</Text>;
      case 'function':
      default:
        return suffix;
    }
  };

  return (
    <View>
      <Pressable
        style={[
          styles.container,
          style,
          disabled && styles.disabled,
          Boolean(error) && styles.errorBorder,
        ]}
        disabled={disabled}
        onPress={_onPress}>
        {leftButtons?.map((button, index) => {
          const _onPress = () => button.onPress?.();
          const startStyle =
            index === 0
              ? {
                  borderBottomLeftRadius: styles.container.borderRadius,
                  borderTopLeftRadius: styles.container.borderRadius,
                }
              : {};
          return (
            <Touchable
              key={index}
              style={[styles.button, startStyle, button.style]}
              disabled={!button.onPress}
              onPress={_onPress}>
              {!!button.text && (
                <Text style={[styles.buttonText, button.textStyle]}>
                  {button.text}
                </Text>
              )}
              {!!button.icon && (
                <Image
                  source={button.icon}
                  style={[button.iconStyle]}
                  resizeMode="contain"
                />
              )}
            </Touchable>
          );
        })}
        <View style={styles.inputContainer}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {Boolean(required) && <Text style={styles.required}>* </Text>}
            {title}
          </Text>
          {Boolean(renderContent) ? (
            renderContent
          ) : (
            <View style={styles.inputContent}>
              {!isNil(editable) && editable === false ? (
                <Text
                  style={[
                    styles.input,
                    inputStyle,
                    isEmpty(displayValue) && {
                      color: props.placeholderTextColor,
                    },
                  ]}
                  numberOfLines={1}
                  {...rest}>
                  {displayValue || props.placeholder}
                </Text>
              ) : (
                <TextInput
                  ref={_ref}
                  style={[styles.input, inputStyle]}
                  onPressIn={_onPress}
                  value={displayValue}
                  onChangeText={handleChangeText}
                  onBlur={handleBlur}
                  keyboardType="numeric"
                  {...rest}
                />
              )}
              {_renderSuffix()}
            </View>
          )}
        </View>
        {rightButtons?.map((button, index) => {
          const _onPress = () => button.onPress?.();
          const lastStyle =
            index === rightButtons.length - 1
              ? {
                  borderBottomRightRadius: styles.container.borderRadius,
                  borderTopRightRadius: styles.container.borderRadius,
                }
              : {};
          return (
            <Touchable
              key={index}
              style={[styles.button, lastStyle, button.style]}
              disabled={!button.onPress}
              onPress={_onPress}>
              {!!button.text && (
                <Text style={[styles.buttonText, button.textStyle]}>
                  {button.text}
                </Text>
              )}
              {!!button.icon && (
                <Image source={button.icon} style={[button.iconStyle]} />
              )}
            </Touchable>
          );
        })}
      </Pressable>
      {!!error && !hideErrorText && (
        <AnimatedText
          style={styles.errorText}
          entering={FadeIn}
          exiting={FadeOut}>
          {error}
        </AnimatedText>
      )}
    </View>
  );
});

InputNumber.defaultProps = {
  editable: true,
  disabled: false,
  placeholderTextColor: colors.color00000033,
  hideErrorText: false,
  decimalPlaces: 0,
  allowNegative: false,
  thousandSeparator: ',',
  decimalSeparator: '.',
};

export default InputNumber;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.colorDADADA,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: 'row',
  },
  required: {
    color: colors.colorFB4646,
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.color6B7A90,
  },
  inputContainer: {
    flex: 1,
    height: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputContent: {
    flexDirection: 'row',
    marginTop: 6,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    fontWeight: '400',
    color: colors.color161616,
    height: 20,
  },
  suffix: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '400',
    color: colors.color161616,
  },
  errorBorder: {
    borderColor: colors.colorFB4646,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.colorFB4646,
    marginTop: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.color161616,
  },
  disabled: {
    backgroundColor: colors.colorF6F7F9,
  },
});
