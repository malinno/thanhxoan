import { AnimatedCircularButton } from '@app/components/CircularButton';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { POS_ORDER_STATES } from '@app/constants/pos-orders.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  Route,
  SceneRendererProps,
  TabView
} from 'react-native-tab-view';
import PosOrdersScene from './components/PosOrdersScene';

const ROUTES: Route[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  ...POS_ORDER_STATES.map(st => ({
    key: st.id,
    title: st.text,
  })),
];

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.POS_ORDERS_LIST
>;

const PosOrdersListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const screenParams = route.params;

  const [index, setIndex] = useState(0);

  // const { data: countData, refetch } = useCustomersCount();

  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, []),
  // );

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CREATE_POS_ORDER, {
      partnerId: screenParams?.filter?.partner_id,
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

  const renderScene = (props: SceneRendererProps & { route: Route }) => {
    return <PosOrdersScene {...screenParams} {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Đơn bán Đại lý"
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
};

export default PosOrdersListScreen;

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
