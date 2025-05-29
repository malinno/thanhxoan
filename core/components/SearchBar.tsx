import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { debounce, isEmpty, isNil } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ColorValue,
  Image,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import Touchable, { AnimatedTouchable } from './Touchable';
import { IButton } from './Header';

export type SearchBarRef = {
  focus: () => void;
};

export interface SearchBarProps extends TextInputProps {
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: ColorValue;
  autoFocus?: boolean;
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: (value: string) => void;
  onSearch?: (value: string) => void;
  onPressBarcode?: () => void;
  style?: StyleProp<ViewStyle>;
  rightButtons?: IButton[];
  wait?: number | false;
}

const SearchBar = forwardRef((props: SearchBarProps, ref) => {
  const {
    onPress,
    onFocus,
    onBlur,
    onChangeText,
    onSearch,
    style,
    rightButtons,
    wait,
    ...rest
  } = props;

  const [text, setText] = useState<string | undefined>();

  const _inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setText(props.value);
  }, [props.value]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      _inputRef.current?.focus();
    },
  }));

  const _onFocus = () => onFocus?.();

  const _onBlur = () => onBlur?.();

  const debounceCall = useCallback(
    wait
      ? debounce(textParam => {
          onChangeText?.(textParam);
        }, wait)
      : (textParam: string) => onChangeText?.(textParam),
    [wait],
  );

  const _onChangeText = (text: string) => {
    setText(text);
    debounceCall?.(text);
  };

  const _onPressClear = () => {
    _inputRef.current?.clear();
    debounceCall('');
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={1}
      style={[styles.searchBar, style]}>
      <Image source={images.common.search} style={styles.searchIcon} />
      <TextInput
        ref={_inputRef}
        style={styles.searchInput}
        returnKeyLabel="Tìm kiếm"
        returnKeyType="search"
        onFocus={_onFocus}
        onBlur={_onBlur}
        onPressIn={onPress}
        onChangeText={_onChangeText}
        numberOfLines={1}
        {...rest}
      />
      {/* {!onPress && !isEmpty(text) && props.editable !== false && (
        <AnimatedTouchable
          entering={FadeIn}
          exiting={FadeOut}
          onPress={_onPressClear}
          style={styles.clearBtn}>
          <Image source={images.common.closeFilled} />
        </AnimatedTouchable>
      )} */}
      {!isEmpty(rightButtons) && (
        <View style={styles.buttons}>
          {rightButtons?.map((button, index) => {
            return (
              <Touchable
                key={index}
                onPress={button.onPress}
                style={[
                  styles.button,
                  index <= rightButtons.length - 1 && { paddingLeft: 0 },
                ]}>
                {!isNil(button.icon) && (
                  <Image
                    style={[styles.buttonIcon, button.iconStyle]}
                    source={button.icon}
                  />
                )}
              </Touchable>
            );
          })}
        </View>
      )}
    </AnimatedTouchable>
  );
});

SearchBar.defaultProps = {
  placeholder: 'Tìm kiếm',
  placeholderTextColor: colors.colorBDBEC4,
};

const styles = StyleSheet.create({
  searchBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.colorF2F2F3,
    borderWidth: 1,
    borderColor: colors.colorC7D1DB,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    padding: 0,
    color: colors.color25160C,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    padding: 0,
    color: colors.color979797,
  },
  clearBtn: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    right: -20,
  },
  buttons: {
    marginLeft: 8,
  },
  button: {},
  buttonIcon: {},
});

export default SearchBar;
