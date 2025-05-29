import { AnimatedCircularButton } from '@app/components/CircularButton';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { TAttendancesRoute } from '@app/constants/attendance.constant';
import { ROUTE_PLAN_STATES } from '@app/constants/route-plan-states.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import RoutePlansScene from './components/RoutePlansScene';

const ROUTES: Route[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  ...ROUTE_PLAN_STATES.map(st => ({
    key: st.id,
    title: st.text,
  })),
];

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ROUTE_PLANS_LIST
>;

const RoutePlansListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const screenParams = route.params;

  const [index, setIndex] = useState(1);

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CREATE_ROUTE_PLAN, {});
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
    props: SceneRendererProps & { route: TAttendancesRoute },
  ) => {
    return <RoutePlansScene {...screenParams} {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Kế hoạch đi tuyến"
        // rightButtons={[
        //   {
        //     icon: images.common.calendarFilled,
        //     iconStyle: { tintColor: colors.white },
        //     onPress: () => toggleCalendar(),
        //   },
        // ]}
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

export default RoutePlansListScreen;

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
