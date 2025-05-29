import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { FunctionComponent, useCallback } from 'react';
import Text from '../Text';
import Touchable from '../Touchable';
import images from '@images';
import Popup from './Popup';
import { colors } from '@core/constants/colors.constant';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomSheetPopupProps {
  title?: string;
  renderContent?(): React.ReactNode;
  keyboardOffset?: number;
}

const BottomSheetPopup: FunctionComponent<BottomSheetPopupProps> = ({
  title,
  renderContent,
  keyboardOffset,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const { height, progress } = useReanimatedKeyboardAnimation();

  const _close = useCallback(() => {
    Popup.hide();
  }, []);

  const wrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            height.value +
            progress.value * (insets.bottom - 16 + (keyboardOffset || 0)),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingBottom: insets.bottom || 16 },
        wrapperStyle,
      ]}>
      {!!title && (
        <View style={styles.header}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Touchable style={styles.closeBtn} onPress={_close}>
            <Image source={images.common.close} />
          </Touchable>
        </View>
      )}
      <View style={styles.content}>{renderContent?.()}</View>
    </Animated.View>
  );
};

export default BottomSheetPopup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: isIphoneX() ? getBottomSpace() : 16,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.colorE5E5E5,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: colors.black,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  content: {
    minHeight: 150,
    maxHeight: 500,
  },
});
