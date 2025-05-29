import { StyleSheet, useWindowDimensions, View } from 'react-native';
import React, { FC, useState } from 'react';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackActions, useNavigation } from '@react-navigation/native';
import images from '@images';
import Header from '@core/components/Header';
import { Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { colors } from '@core/constants/colors.constant';
import { TAttendancesRoute } from '@app/constants/attendance.constant';
import TimekeepingExplanationsScene from './components/TimekeepingExplanationsScene';
import { TIMEKEEPING_EXPLANATION_STATES } from '@app/constants/timekeeping-explanation.constant';

const ROUTES: Route[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  ...TIMEKEEPING_EXPLANATION_STATES.map(st => ({
    key: st.id,
    title: st.text,
  })),
];

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.TIMEKEEPING_EXPLANATION_LIST
>;

const TimekeepingExplanationListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const screenParams = route.params;

  const [index, setIndex] = useState(0);

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
    return <TimekeepingExplanationsScene {...screenParams} {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Giải trình công"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
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
    </View>
  );
};

export default TimekeepingExplanationListScreen;

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
