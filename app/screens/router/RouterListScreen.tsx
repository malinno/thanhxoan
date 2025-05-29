import { AnimatedCircularButton } from '@app/components/CircularButton';
import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpRouter } from '@app/interfaces/entities/erp-router.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useInfiniteRoutersList } from '@app/queries/erp-router.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import qs from 'qs';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import RouterItem from './components/RouterItem';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.ROUTER_LIST>;

const RouterListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteRoutersList({ query });

  const routers = flatMap(data?.pages, it => it || []);

  const onPressCreate = () => {
    // const params = qs.stringify({
    //   debug: 1,
    //   action: 1765,
    //   cids: 1,
    //   menu_id: 1030,
    //   model: 'dms.config.router',
    //   view_type: 'form',
    // });

    // const url = new URL('web', Config.WEB_BASE_URL);
    // url.hash = params;

    // navigation.navigate(SCREEN.WEBVIEW, { url: String(url) });
    navigation.navigate(SCREEN.CREATE_ROUTER, {});
  };

  const onPressItem = (data: ErpRouter) => {
    navigation.navigate(SCREEN.ROUTER_DETAIL, { id: data.id });
  };

  const renderItem: ListRenderItem<ErpRouter> = ({ item, index }) => {
    return (
      <RouterItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const onEndReached = () => {
    !isFetching && fetchNextPage();
  };

  const ListFooterComponent = () => {
    if (isFetching) return <ListFetching />;
  };

  return (
    <View style={styles.container}>
      <Header title="Tuyến bán hàng" />

      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.filterBtn}>
          <Image source={images.common.filter} />
        </Touchable>
      </HStack>

      <FlashList
        data={routers}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={isRefetching || isFetching ? null : <ListEmpty />}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />

      <AnimatedCircularButton
        icon={images.common.add}
        style={[styles.btn, styles.createBtn]}
        onPress={onPressCreate}
      />
    </View>
  );
};

export default RouterListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 12,
  },
  searchBar: {
    marginLeft: 16,
    flex: 1,
    backgroundColor: colors.white,
  },
  filterBtn: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  item: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  btn: {
    position: 'absolute',
    right: 16,
  },
  createBtn: {
    bottom: 28,
  },
});
