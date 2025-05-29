import { AnimatedCircularButton } from '@app/components/CircularButton';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { SCREEN } from '@app/enums/screen.enum';
import { TabParamsList } from '@app/navigators/RootNavigator';
import { useCustomersCount } from '@app/queries/customer.query';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isNil } from 'lodash';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  Route,
  SceneRendererProps,
  TabBarItem,
  TabBarItemProps,
  TabView,
} from 'react-native-tab-view';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';
import ClientsScene from './components/ClientsScene';

const ROUTES: Route[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  {
    key: 'distributor',
    title: 'NPP',
  },
  {
    key: 'agency',
    title: 'Đại lý',
  },
];

type Props = BottomTabScreenProps<TabParamsList, SCREEN.CLIENTS_TAB>;

const ClientsTab = React.memo((props: Props) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const { data: countData, refetch } = useCustomersCount();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const onPressCreate = () => navigation.navigate(SCREEN.CREATE_CLIENT, {});

  const renderTabLabel = useCallback(
    ({
      route,
      focused,
      color,
    }: Scene<Route> & {
      focused: boolean;
      color: string;
    }): React.ReactNode => {
      let count = 0;
      if (!isNil(countData))
        count = route.key === 'all' ? countData['total'] : countData[route.key];
      return (
        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            { color },
            focused && { fontWeight: '600' },
          ]}>
          {`${route.title} ${count ? `(${count})` : ''} `}
        </Text>
      );
    },
    [countData],
  );

  const renderTabBarItem = useCallback(
    ({ ...props }: TabBarItemProps<Route> & { key: string }) => {
      return <TabBarItem {...props} renderLabel={renderTabLabel} />;
    },
    [countData],
  );

  const renderTabBar = (props: RNTabBarProps) => {
    return (
      <MyCustomTabBar
        {...props}
        scrollEnabled
        tabStyle={{ width: 'auto' }}
        inactiveColor={colors.color6B7A90}
        renderTabBarItem={renderTabBarItem}
      />
    );
  };

  const renderScene = (props: SceneRendererProps & { route: Route }) => {
    return <ClientsScene {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách khách hàng"
        rightButtons={[
          {
            icon: images.client.notification,
            onPress: () => navigation.navigate(SCREEN.NOTIFICATIONS_LIST, {}),
          },
        ]}
      />
      <TabView
        navigationState={{ index, routes: ROUTES }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
      />

      <AnimatedCircularButton
        icon={images.common.add}
        style={[styles.btn, styles.createBtn]}
        onPress={onPressCreate}
      />
    </View>
  );
});

export default ClientsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    position: 'absolute',
    right: 16,
  },
  createBtn: {
    bottom: 28,
  },
  tabLabel: {
    fontWeight: '400',
    textAlign: 'center',
    // borderWidth: 1,
    // borderColor: 'transparent',
  },
});
