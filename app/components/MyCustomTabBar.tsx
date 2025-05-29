import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC, useCallback } from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  Route,
  TabBar,
  TabBarItem,
  TabBarItemProps,
  TabBarProps
} from 'react-native-tab-view';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';

export type RNTabBarProps = TabBarProps<Route>;
export interface MyCustomTabBarProps extends RNTabBarProps {}

const MyCustomTabBar: FC<MyCustomTabBarProps> = ({ style, ...props }) => {
  const renderTabLabel = useCallback(
    ({
      route,
      focused,
      color,
    }: Scene<Route> & {
      focused: boolean;
      color: string;
    }): React.ReactNode => {
      return (
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            { color },
            focused && { fontWeight: '600' },
          ]}>
          {`${route.title} `}
        </Text>
      );
    },
    [],
  );

  const renderTabBarItem = useCallback(
    ({ ...props }: TabBarItemProps<Route> & { key: string }) => {
      return <TabBarItem {...props} renderLabel={renderTabLabel} />;
    },
    [],
  );

  return (
    <TabBar
      style={[styles.tabBar, style]}
      activeColor={colors.primary}
      inactiveColor={colors.color6B7A90}
      renderTabBarItem={renderTabBarItem}
      indicatorStyle={styles.indicator}
      {...props}
    />
  );
};

export default MyCustomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorECEEF2,
    borderTopWidth: 0,
    elevation: 0,
    height: 50,
  },
  tabLabel: {
    fontWeight: '400',
    textAlign: 'center',
    // borderWidth: 1,
    // borderColor: 'transparent',
  },
  indicator: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
