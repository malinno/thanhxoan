import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import {
  ATTENDANCE_TAB_ROUTES,
  TAttendancesRoute,
} from '@app/constants/attendance.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SceneRendererProps, TabView } from 'react-native-tab-view';
import AttendancesScene from './components/AttendancesScene';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ATTENDANCE_LIST
>;

const AttendanceListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const screenParams = route.params;

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<TAttendancesRoute[]>([]);

  useEffect(() => {
    const now = dayjs();
    setRoutes([
      {
        key: 'all',
        title: 'Tất cả',
      },
      {
        key: 'current_week',
        title: 'Tuần này',
        from_date: now.startOf('week').format('YYYY-MM-DD'),
        to_date: now.endOf('week').format('YYYY-MM-DD'),
      },
      {
        key: 'current_month',
        title: 'Tháng này',
        from_date: now.startOf('month').format('YYYY-MM-DD'),
        to_date: now.endOf('month').format('YYYY-MM-DD'),
      },
    ]);
  }, []);

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
    return <AttendancesScene {...screenParams} {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Bảng tổng hợp công ngày"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />
      {!isEmpty(routes) && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          lazy
        />
      )}
    </View>
  );
};

export default AttendanceListScreen;

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
