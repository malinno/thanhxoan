import MyCustomTabBar, { RNTabBarProps } from '@app/components/MyCustomTabBar';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useExhibitionGroupsList } from '@app/queries/exhibition-group.query';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { find, isEmpty } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Route, SceneRendererProps, TabView } from 'react-native-tab-view';
import ShowcaseImagesScene from './components/ShowcaseImagesScene';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.SHOWCASE_DECLARATION_IMAGES
>;

export type ShowcaseImagesListRoute = Route & {
  images?: string[];
};

const ShowcaseImagesListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const { data: exhibitionGroups } = useExhibitionGroupsList();

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<ShowcaseImagesListRoute[]>([]);

  useEffect(() => {
    if (!exhibitionGroups) return;

    const mRoutes = exhibitionGroups.reduce((prev: ShowcaseImagesListRoute[], group) => {
      const item: ShowcaseImagesListRoute = {
        key: String(group.id),
        title: group.name,
      };
      if (route.params.imageGroups) {
        const images = find(
          route.params.imageGroups,
          it => it.group.id === group.id,
        )?.images;
        if (images && !isEmpty(images)) {
          item.images = images;
          item.title += ` (${images.length})`;

          prev.push(item);
        }
      }
      return prev;
    }, [])

    setRoutes(mRoutes);
  }, [route.params.imageGroups, exhibitionGroups]);

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
    return <ShowcaseImagesScene {...props} />;
  };

  return (
    <View style={styles.container}>
      <Header title="Danh sách hình ảnh" />

      {!!routes && !isEmpty(routes) && (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      )}
    </View>
  );
};

export default ShowcaseImagesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
