import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { CHECK_IO_EXPLANATION_STATUSES } from '@app/constants/check-io-explanation.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import CheckInOutExplanationsScene from './components/CheckInOutExplanationsScene';

const ROUTES: Route[] = CHECK_IO_EXPLANATION_STATUSES.map(st => ({
  key: st.id,
  title: st.text,
}));

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CHECK_IN_OUT_EXPLANATIONS_LIST
>;

const CheckInOutExplanationsListScreen: FC<Props> = ({ route, ...props }) => {
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

  const renderScene = (props: SceneRendererProps & { route: Route }) => {
    return <CheckInOutExplanationsScene {...screenParams} {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Giải trình check in - out"
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

export default CheckInOutExplanationsListScreen;

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
