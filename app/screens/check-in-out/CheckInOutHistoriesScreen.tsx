import { AnimatedCircularButton } from '@app/components/CircularButton';
import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { ErpCheckInOut } from '@app/interfaces/entities/erp-checkin-out.entity';
import { CheckInOutFilter } from '@app/interfaces/query-params/check-in-out.filter';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useInfiniteCheckInOutList } from '@app/queries/check-in-out.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import CheckInOutHistoryItem from './components/CheckInOutHistoryItem';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CHECK_IN_OUT_HISTORIES
>;

const CheckInOutHistoriesScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const { screenTitle } = route.params

  const [filter, setFilter] = useState<CheckInOutFilter>();
  const [query, setQuery] = useState('');

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteCheckInOutList({
      ...route.params?.filter,
      ...filter,
      query,
    });

  const records = flatMap(data?.pages, it => it || []);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.CHECK_IN_OUT_FILTER, {
      filter,
      onChange: setFilter,
    });
  };

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CHECK_IN_OUT, {
      storeId: route.params.filter?.store_id,
    });
  };

  const onPressItem = (item: ErpCheckInOut) => {
    navigation.navigate(SCREEN.CHECK_IN_OUT, { checkInOutId: item.id });
  };

  const renderItem: ListRenderItem<ErpCheckInOut> = ({ item, index }) => {
    return (
      <CheckInOutHistoryItem
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
    return null;
  };

  return (
    <View style={styles.container}>
      <Header
        title={screenTitle}
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />

      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.filterBtn} onPress={onPressAdvanceFilter}>
          <Image source={images.common.filter} />
        </Touchable>
      </HStack>

      <FlashList
        data={records}
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

      {Boolean(route.params?.filter?.store_id) && (
        <AnimatedCircularButton
          icon={images.common.add}
          style={[styles.btn, styles.createBtn]}
          onPress={onPressCreate}
        />
      )}
    </View>
  );
};

export default CheckInOutHistoriesScreen;

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
    zIndex: 2,
  },
  createBtn: {
    bottom: 28,
  },
});
