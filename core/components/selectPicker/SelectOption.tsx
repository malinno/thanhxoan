import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { isEmpty, isNil } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Image, Keyboard, ScrollView, TextInput, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Modal from 'react-native-modal';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SelectOptionItem from './SelectOptionItem';
import { Option, SelectOptionParams } from './SelectPicker.interface';
import styles from './SelectPicker.style';

interface Props {}

const SelectOption = forwardRef((props: Props, ref) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const _params = useRef<SelectOptionParams>();

  const { height } = useReanimatedKeyboardAnimation();

  useImperativeHandle(ref, () => ({
    open: (params: SelectOptionParams) => _open(params),
    close: () => _close(),
  }));

  const _open = async (params: SelectOptionParams) => {
    if (isNil(params)) return;
    Keyboard.dismiss();
    await global.sleep(200);
    
    _params.current = params;
    setQuery('');
    setVisible(true);
  };

  const _close = useCallback(() => {
    _params.current = undefined;
    setVisible(false);
  }, []);

  const { options, data, onSelected, title, renderEmpty } =
    _params.current || {};

  const _onSelected = (option: Option) => {
    _close();
    if (onSelected) {
      setTimeout(() => {
        onSelected(option, data);
      }, 500);
    }
  };

  const { containerComponent, containerStyle } = _params.current || {};
  const Wrapper = containerComponent || ScrollView;

  const optionRender = options?.filter(item => {
    if (isEmpty(query)) return true;
    if (!item.text) return false;
    return item.text.toLowerCase()?.indexOf(query?.toLowerCase()) > -1;
  });

  const wrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: height.value }],
    };
  });

  return (
    <Modal
      isVisible={visible}
      useNativeDriver={true}
      onBackdropPress={_close}
      onBackButtonPress={_close}
      hideModalContentWhileAnimating
      style={styles.modal}>
      <Animated.View
        style={[
          styles.container,
          { paddingBottom: insets.bottom },
          wrapperStyle,
        ]}>
        {!!title && (
          <View style={styles.header}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Touchable style={styles.closeBtn} onPress={_close}>
              <Image source={images.common.close} tintColor={colors.black} />
            </Touchable>
          </View>
        )}
        <Animated.View style={[styles.content, containerStyle]}>
          {options && options.length > 10 && (
            <View style={styles.search}>
              <Image source={images.common.search} style={styles.searchIcon} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm kiếm"
                style={styles.searchInput}
                numberOfLines={1}
                placeholderTextColor={colors.colorBDBEC4}
              />
            </View>
          )}
          <Wrapper>
            {isEmpty(optionRender) && Boolean(renderEmpty) && renderEmpty}

            {optionRender?.map((item, index) => {
              const _onPress = () => _onSelected(item);
              const isLast = index === optionRender?.length - 1;
              return (
                <SelectOptionItem
                  key={item.key}
                  option={item}
                  onPress={_onPress}
                  separator={!isLast}
                />
              );
            })}
          </Wrapper>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

export default SelectOption;
