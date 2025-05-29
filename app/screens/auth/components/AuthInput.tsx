import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Touchable from '@core/components/Touchable';
import images from '@images';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import Animated from 'react-native-reanimated';

export type AuthInputRef = {
  focus: () => void;
}

interface Props extends TextInputProps {
  renderSecuredSwitch?: React.ReactNode;
  prefix?: ImageSourcePropType | string | React.ReactNode;
  suffix?: ImageSourcePropType | string | React.ReactNode;
  textInputStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  error?: string;
}

const AuthInput = forwardRef<AuthInputRef, Props>(
  (
    {
      secureTextEntry,
      prefix,
      suffix,
      style,
      textInputStyle,
      onPress,
      error,
      ...props
    },
    ref,
  ) => {
    const [secured, setSecured] = useState(secureTextEntry);

    const _ref = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        _ref.current?.focus();
      },
    }));

    const _toggleSecured = () => setSecured(preState => !preState);

    const _onPress = () => {
      onPress?.() || _ref.current?.focus();
    };

    const _renderPrefix = () => {
      if (!prefix) return;
      switch (typeof prefix) {
        case 'string':
          return <Text style={styles.prefix}>{prefix}</Text>;
        case 'function':
          return prefix;
        default:
          // @ts-ignore
          return <Image source={prefix} style={styles.prefix} />;
          break;
      }
    };

    const _renderSuffix = () => {
      if (secureTextEntry) {
        return (
          <Touchable style={styles.securedBtn} onPress={_toggleSecured}>
            <Image
              source={secured ? images.common.eye : images.common.eyeClosed}
            />
          </Touchable>
        );
      }

      if (!suffix) return;
      switch (typeof suffix) {
        case 'string':
          return <Text>{suffix}</Text>;
        case 'function':
          return suffix;
        default:
          // @ts-ignore
          return <Image source={suffix} />;
          break;
      }
    };

    return (
      <Touchable
        style={[styles.input, style, error ? styles.errorBorder : {}]}
        onPress={_onPress}>
        {_renderPrefix()}
        <TextInput
          ref={_ref}
          style={[styles.textInput, textInputStyle]}
          placeholderTextColor={colors.color68788E}
          secureTextEntry={secured}
          onPressIn={onPress}
          {...props}
        />
        {_renderSuffix()}
      </Touchable>
    );
  },
);

export default AuthInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderRadius: 6,
    paddingHorizontal: 19,
  },
  prefix: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    marginTop: 2,
    padding: 0,
    fontSize: 16,
    fontWeight: '400',
    color: colors.color161616,
  },
  icon: {
    marginRight: 12,
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
  securedBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
