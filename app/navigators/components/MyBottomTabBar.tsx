import { SCREEN } from '@app/enums/screen.enum';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Canvas,
  Circle,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import { isNil } from 'lodash';
import QueryString from 'qs';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MIDDLE_ICON_SIZE = 46;

const MyTabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withTiming(state.index, { duration: 200 });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => {
    const input = Array.from({ length: state.routes.length }, (_, i) => i);
    const translateXOutput = Array.from(
      { length: state.routes.length },
      (_, i) => (i * dimensions.width) / state.routes.length,
    );
    const opacityOutput = Array.from({ length: state.routes.length }, (_, i) =>
      i === 2 ? 0 : 1,
    );
    return {
      opacity: interpolate(
        offset.value,
        input,
        opacityOutput,
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateX: interpolate(
            offset.value,
            input,
            translateXOutput,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.tabBar]}>
      <Animated.View
        style={[
          styles.indicator,
          { width: dimensions.width / state.routes.length },
          indicatorStyle,
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const activeTintColor = options.tabBarActiveTintColor || colors.primary;
        const inactiveTintColor =
          options.tabBarInactiveTintColor || colors.color6B7A90;

        const onPress = () => {
          switch (route.name) {
            case SCREEN.CREATE_ORDER_TAB:
              navigation.navigate(SCREEN.CREATE_POS_ORDER);
              break;
            default:
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const _renderTabBarIcon = () => {
          if (isNil(options.tabBarIcon)) return null;

          if (index === 2) {
            return (
              <View style={styles.middleIcon}>
                <Canvas style={StyleSheet.absoluteFill}>
                  <Circle
                    cx={MIDDLE_ICON_SIZE / 2 - 1}
                    cy={MIDDLE_ICON_SIZE / 2 - 1}
                    r={MIDDLE_ICON_SIZE / 2 - 1}>
                    <RadialGradient
                      c={vec(MIDDLE_ICON_SIZE / 2, MIDDLE_ICON_SIZE / 2)}
                      r={MIDDLE_ICON_SIZE / 2}
                      colors={[colors.color5B98F4, colors.color2745D4]}
                    />
                  </Circle>
                </Canvas>
                {options.tabBarIcon({
                  focused: isFocused,
                  color: colors.white,
                  size: 18,
                })}
              </View>
            );
          }

          return options.tabBarIcon({
            focused: isFocused,
            color: isFocused ? activeTintColor : inactiveTintColor,
            size: 20,
          });
        };

        return (
          <Touchable
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabBarItem, { paddingBottom: insets.bottom }]}
            activeOpacity={1}>
            {_renderTabBarIcon()}
            <Text
              numberOfLines={1}
              style={[
                styles.tabBarLabel,
                { color: isFocused ? activeTintColor : inactiveTintColor },
                isFocused && { fontWeight: '600' },
              ]}>
              {String(label)}
            </Text>
          </Touchable>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  tabBarItem: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleIcon: {
    width: MIDDLE_ICON_SIZE,
    height: MIDDLE_ICON_SIZE,
    borderRadius: MIDDLE_ICON_SIZE / 2,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.white,
    elevation: 2,
    marginTop: (MIDDLE_ICON_SIZE / 2) * -1 - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 6,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
});

export default MyTabBar;
