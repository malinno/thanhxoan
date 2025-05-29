import ListEmpty from '@app/components/ListEmpty';
import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import NotificationItem from './components/NotificationItem';

const ROUTES: Route[] = [
  {
    key: 'new',
    title: 'Mới',
  },
  {
    key: 'unread',
    title: 'Chưa đọc',
  },
  {
    key: 'all',
    title: 'Tất cả',
  },
];

export type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.NOTIFICATIONS_LIST
>;

const NotificationsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const renderTabBar = (props: RNTabBarProps) => {
    return <MyCustomTabBar {...props} />;
  };

  const renderItem: ListRenderItem<unknown> = ({ item, index }) => {
    return <NotificationItem data={item} index={index} />;
  };

  const renderScene = (props: SceneRendererProps & { route: Route }) => {
    return (
      <FlashList
        data={Array.from({ length: 50 }, (v, i) => i)}
        renderItem={renderItem}
        estimatedItemSize={107}
        ListEmptyComponent={<ListEmpty />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Thông báo" />
      <TabView
        navigationState={{ index, routes: ROUTES }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default NotificationsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
