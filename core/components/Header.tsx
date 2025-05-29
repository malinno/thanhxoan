import { colors } from '@core/constants/colors.constant';
import { OS_VERSION } from '@core/constants/core.constant';
import LayoutUtils from '@core/utils/LayoutUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { isEmpty, isNil } from 'lodash';
import React, { FC, ReactNode, memo, useCallback } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  BounceIn,
  BounceOut,
  FadeIn,
  FadeInLeft,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text, { AnimatedText } from './Text';
import Touchable, { AnimatedTouchable, TouchableProps } from './Touchable';

export interface IButton extends TouchableProps {
  icon?: ImageSourcePropType;
  text?: string;
  badge?: number;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface IHeaderProps {
  headerLeft?: any;
  headerRight?: ReactNode;
  disabledHeaderLeft?: boolean;
  title?: string;
  autoCapitalize?: boolean;
  onPressBack?: () => void;
  mode?: 'modal' | 'full';
  footer?: ReactNode;
  titleComponent?: ReactNode;
  canGoBack?: boolean;
  leftButtons?: IButton[];
  rightButtons?: IButton[];
  style?: StyleProp<ViewStyle>;
  absoluteButtons?: boolean;
}

export const HeaderButton: FC<IButton> = memo(
  ({ style, icon, iconStyle, text, textStyle, badge, ...props }) => {
    return (
      <Touchable {...props} style={[styles.button, style]}>
        {!isNil(icon) && (
          <Image
            style={[styles.buttonIcon, iconStyle]}
            source={icon}
            resizeMode="contain"
          />
        )}
        {!isEmpty(text) && (
          <Text style={[styles.btnText, textStyle]}>{text}</Text>
        )}
        {!isNil(badge) && badge > 0 && (
          <Animated.View
            style={styles.badge}
            entering={BounceIn}
            exiting={BounceOut}
            layout={Layout.springify()}>
            <AnimatedText style={styles.badgeText}>
              {badge > 99 ? '99+' : badge}
            </AnimatedText>
          </Animated.View>
        )}
      </Touchable>
    );
  },
);

const Header: FC<IHeaderProps> = memo(
  ({
    headerLeft,
    headerRight,
    disabledHeaderLeft,
    title,
    autoCapitalize,
    onPressBack,
    mode,
    footer,
    titleComponent,
    leftButtons,
    rightButtons,
    style,
    absoluteButtons,
    ...props
  }) => {
    const insets = useSafeAreaInsets();
    const mTitle = autoCapitalize ? title?.toUpperCase() : title;
    const navigation = useNavigation();
    const canGoBack = navigation.getState()?.index;

    const _onPressBackBtn = useCallback(() => {
      if (onPressBack) onPressBack();
      else navigation.goBack();
    }, [navigation, onPressBack]);

    const _renderTitle = useCallback(() => {
      if (isNil(titleComponent))
        return (
          <AnimatedText
            numberOfLines={1}
            style={styles.title}
            layout={FadeIn.springify()}>
            {mTitle || ''}
          </AnimatedText>
        );
      return titleComponent;
    }, [titleComponent, mTitle]);

    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top },
          mode === 'modal' &&
            Platform.OS === 'ios' &&
            OS_VERSION.ios >= 13 &&
            styles.modalHeader,
          style,
        ]}>
        <View style={styles.header}>
          {/* Render Left components */}
          <View
            style={[
              styles.headerLeft,
              !absoluteButtons && { position: 'relative' },
            ]}>
            {leftButtons?.map((item, index) => {
              const { style, ...itemProps } = item;
              return (
                <HeaderButton
                  key={index}
                  {...itemProps}
                  style={[
                    style,
                    index <= leftButtons.length - 1 && { paddingRight: 0 },
                  ]}
                />
              );
            })}
            {canGoBack &&
              isNil(headerLeft) &&
              !disabledHeaderLeft &&
              isNil(leftButtons) && <BackButton onPress={_onPressBackBtn} />}
            {!isNil(headerLeft) && headerLeft}
          </View>

          {/* Render header title */}
          {_renderTitle()}

          {/* Render right components */}
          <View
            style={[
              styles.headerRight,
              !absoluteButtons && { position: 'relative' },
            ]}>
            {rightButtons?.map((item, index) => {
              const { style, ...itemProps } = item;
              return (
                <HeaderButton
                  key={index}
                  {...itemProps}
                  style={[
                    style,
                    index <= rightButtons.length - 1 && { paddingLeft: 0 },
                  ]}
                />
              );
            })}
            {!isNil(headerRight) && isNil(rightButtons) && headerRight}
          </View>
        </View>
        {!isNil(footer) && footer}
      </View>
    );
  },
);

export const BackButton: FC<TouchableProps> = memo(({ style, ...props }) => {
  return (
    <AnimatedTouchable
      // entering={FadeInRight.delay(100)}
      // exiting={FadeOutRight}
      style={[styles.backButton, style]}
      {...props}>
      <Image
        style={styles.backIcon}
        source={images.navigation.back}
        resizeMode="contain"
        // tintColor={colors.white}
      />
    </AnimatedTouchable>
  );
});

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    backgroundColor: colors.color2745D4,
    // borderBottomWidth: 1,
    // borderColor: colors.placeholder,
  },
  modalHeader: {
    paddingTop: 0,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.white,
    maxWidth: LayoutUtils.size(242),
  },
  headerLeft: {
    position: 'absolute',
    left: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    position: 'absolute',
    right: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.red
  },
  backIcon: {
    tintColor: colors.white,
  },
  button: {
    padding: 16,
  },
  buttonIcon: {
    maxWidth: 40,
    maxHeight: 40,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red,
    paddingHorizontal: 2,
  },
  badgeText: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    color: colors.white,
  },
});

Header.defaultProps = {
  autoCapitalize: false,
  canGoBack: true,
  absoluteButtons: true,
};

export default Header;
