import { AnimatedCircularButton } from '@app/components/CircularButton';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import {
  SALE_ORDER_STATES,
  TSaleOrdersRoute
} from '@app/constants/sale-orders.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { SaleOrdersFilter } from '@app/interfaces/query-params/sale-orders.filter';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Route,
  SceneRendererProps,
  TabView
} from 'react-native-tab-view';
import SaleOrdersScene from './SaleOrdersScene';

const ROUTES: Route[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  ...SALE_ORDER_STATES.map(st => ({
    key: st.id,
    title: st.text,
  })),
];

interface Props {
  filter?: SaleOrdersFilter;
}

const SaleOrdersList: FC<Props> = ({ ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  // const { data: countData, refetch } = useCustomersCount();

  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, []),
  // );

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CREATE_SALE_ORDER, {
      partnerId: props?.filter?.partner_id,
    });
  };

  const renderTabBar = (props: RNTabBarProps) => {
    return (
      <MyCustomTabBar
        {...props}
        scrollEnabled
        tabStyle={{ width: 'auto' }}
        inactiveColor={colors.color6B7A90}
      />
    );
  };

  const renderScene = (
    sceneProps: SceneRendererProps & { route: TSaleOrdersRoute },
  ) => {
    return <SaleOrdersScene {...props} {...sceneProps} />;
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default SaleOrdersList;

const styles = StyleSheet.create({
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
