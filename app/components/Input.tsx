import Text, { AnimatedText } from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { isEmpty, isNil } from 'lodash';
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

export interface InputRef {
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

interface InputProps extends TextInputProps {
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
  hideErrorText?: boolean
  inputStyle?: StyleProp<TextStyle>
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  if (!props.value) props.value = undefined;

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
    secureTextEntry,
    renderContent,
    hideErrorText,
    inputStyle,
    ...rest
  } = props;
  const editable = props.editable && !disabled;
  const [secured, setSecured] = useState(secureTextEntry || false);
  const _ref = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      _ref.current?.focus();
    },
  }));

  const _toggleSecured = () => setSecured(!secured);

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
                    isEmpty(props.value) && {
                      color: props.placeholderTextColor,
                    },
                  ]}
                  numberOfLines={1}
                  {...rest}>
                  {props.value || props.placeholder}
                </Text>
              ) : (
                <TextInput
                  ref={_ref}
                  style={[styles.input, inputStyle]}
                  onPressIn={_onPress}
                  secureTextEntry={secured}
                  {...rest}
                />
              )}
              {_renderSuffix()}
            </View>
          )}
        </View>
        {secureTextEntry && (
          <Touchable style={[styles.button]} onPress={_toggleSecured}>
            <Image
              source={secured ? images.common.eye : images.common.eyeClosed}
            />
          </Touchable>
        )}
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

Input.defaultProps = {
  editable: true,
  disabled: false,
  placeholderTextColor: colors.color00000033,
  hideErrorText: false
};

export default Input;

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
