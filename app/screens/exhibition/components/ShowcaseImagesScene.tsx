import { SCREEN } from '@app/enums/screen.enum';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SceneRendererProps } from 'react-native-tab-view';
import { ShowcaseImagesListRoute } from '../ShowcaseImagesListScreen';
import ListEmpty from '@app/components/ListEmpty';

const NUM_COLS = 3;

interface Props extends SceneRendererProps {
  route: ShowcaseImagesListRoute;
}

const ShowcaseImagesScene: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const onPressItem = (index: number) => {
    navigation.navigate(SCREEN.PHOTO_VIEWER, {
      index,
      images: route.images || [],
    });
  };

  const renderItem: ListRenderItem<string> = ({ item, index }) => {
    const _onPress = () => onPressItem(index);
    return (
      <Touchable style={styles.item} onPress={_onPress}>
        <FastImage
          style={styles.img}
          source={{ uri: Boolean(item) ? item : undefined }}
          resizeMode='cover'
        />
      </Touchable>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        numColumns={NUM_COLS}
        data={route.images}
        renderItem={renderItem}
        estimatedItemSize={109}
        contentContainerStyle={styles.scrollContent}
        // refreshing={isLoading}
        // onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />
    </View>
  );
};

export default ShowcaseImagesScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  item: {
    flex: 1,
  },
  img: {
    margin: 4,
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.colorDADADA,
  },
});
