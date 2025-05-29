import { AnimatedCircularButton } from '@app/components/CircularButton';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { ReturnProductState } from '@app/enums/return-product.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomersCount } from '@app/queries/customer.query';
import { useProposalProductReturnGroupList } from '@app/queries/return-product.query';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isNil, sum } from 'lodash';
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
import ReturnProductScene from './components/ReturnProductScene';

const ROUTES: Route[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  {
    key: ReturnProductState.draft,
    title: 'Dự thảo',
  },
  {
    key: ReturnProductState.waiting_approve,
    title: 'Chờ duyệt',
  },
  {
    key: ReturnProductState.verified,
    title: 'Đã xác thực',
  },
  {
    key: ReturnProductState.confirmed,
    title: 'Đã xác nhận',
  },
  {
    key: ReturnProductState.completed,
    title: 'Hoàn thành',
  },
  {
    key: ReturnProductState.canceled,
    title: 'Đã hủy',
  },
];

type Props = BottomTabScreenProps<
  RootStackParamsList,
  SCREEN.RETURN_PRODUCTS_LIST
>;

const ReturnProductList = React.memo((props: Props) => {
  const { partnerId } = props.route.params;
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const { data: countData, refetch } = useCustomersCount();
  const { data: countDataGroup } = useProposalProductReturnGroupList(
    Number(partnerId),
    !!partnerId,
  );
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const onPressCreate = () =>
    navigation.navigate(SCREEN.CREATE_RETURN_PRODUCT, {
      partnerId: props.route.params.partnerId,
    });

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
      if (!isNil(countDataGroup))
        count =
          route.key === 'all'
            ? sum(Object.values(countDataGroup))
            : countDataGroup[route.key as ReturnProductState];
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
    [countDataGroup],
  );

  const renderTabBarItem = useCallback(
    ({ ...props }: TabBarItemProps<Route> & { key: string }) => {
      return <TabBarItem {...props} renderLabel={renderTabLabel} />;
    },
    [countDataGroup],
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
    return <ReturnProductScene {...props} partnerId={partnerId} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Đơn đổi trả"
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

export default ReturnProductList;

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
