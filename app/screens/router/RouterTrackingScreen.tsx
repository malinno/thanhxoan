import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import { SCREEN } from '@app/enums/screen.enum';
import {
  TLastCheckIn,
  TRouterTrackingStore,
  useRouterTracking,
} from '@app/hooks/useRouterTracking';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCheckInOutList } from '@app/queries/check-in-out.query';
import { useCustomers } from '@app/queries/customer.query';
import { useRouterDetail, useRoutersList } from '@app/queries/erp-router.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { find } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Image, InteractionManager, StyleSheet, View } from 'react-native';
import RouterTrackingStoreItem from './components/RouterTrackingStoreItem';
import { useAuth } from '@app/hooks/useAuth';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ROUTER_TRACKING
>;

const RouterTrackingScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const selectedRouter = useRouterTracking(state => state.selectedRouter);
  const setSelectedRouter = useRouterTracking(state => state.setSelectedRouter);
  const routerStores = useRouterTracking(state => state.routerStores);
  const setRouterStores = useRouterTracking(state => state.setRouterStores);

  const [query, setQuery] = useState('');

  const {
    data: routers,
    isFetching: isFetchingRouterList,
    isRefetching: isRefetchingRouterList,
  } = useRoutersList();
  const {
    data: routerData,
    refetch: refetchRouterDetail,
    isFetching: isFetchingRouter,
    isRefetching: isRefetchingRouter,
  } = useRouterDetail(selectedRouter?.id, false);
  const {
    data: storeCheckInList,
    refetch: refetchStoreCheckInList,
    isFetching: isFetchingStoreCheckInList,
    isRefetching: isRefetchingStoreCheckInList,
  } = useCheckInOutList(
    {
      store_ids: routerData?.store_ids?.map(s => s.id).join(','),
      from_date: dayjs().startOf('day').format('YYYY-MM-DD'),
      salesperson_id: user?.id,
    },
    false,
  );
  const {
    data: storeList,
    refetch: refetchStores,
    isFetching: isFetchingStores,
    isRefetching: isRefetchingStores,
  } = useCustomers(
    { id: routerData?.store_ids?.map(s => s.id).join(',') },
    false,
  );

  const isRefetching =
    isRefetchingRouterList ||
    isRefetchingRouter ||
    isRefetchingStoreCheckInList ||
    isRefetchingStores;

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (routerData?.store_ids) {
          refetchStoreCheckInList();
          refetchStores();
        }
      });

      return () => task.cancel();
    }, [routerData]),
  );

  useEffect(() => {
    if (routers && !selectedRouter) {
      const dayOfWeek = dayjs().weekday();
      const router = find(routers, r => r.day_of_week === String(dayOfWeek));
      if (router) setSelectedRouter(router);
      else setSelectedRouter(routers?.[0]);
    }
  }, [routers]);

  useEffect(() => {
    if (selectedRouter) refetchRouterDetail();
  }, [selectedRouter]);

  useEffect(() => {
    if (routerData?.store_ids) {
      refetchStoreCheckInList();
      refetchStores();
    }
  }, [routerData]);

  useEffect(() => {
    const lastCheckInLookup = storeCheckInList?.reduce(
      (prev: Record<string, TLastCheckIn>, checkIn) => {
        if (prev[checkIn.store_id.id]) {
          if (
            checkIn.check_in &&
            checkIn.check_in > prev[checkIn.store_id.id].check_in
          )
            prev[checkIn.store_id.id] = checkIn;
        } else {
          prev[checkIn.store_id.id] = checkIn;
        }
        return prev;
      },
      {},
    );

    const storeLastCheckInDaysLookup = storeList?.reduce(
      (prev: Record<string, number>, store) => {
        prev[store.id] = store.checkin_last_days || -1;
        return prev;
      },
      {},
    );

    const stores: TRouterTrackingStore[] = routerData?.store_ids ?? [];
    for (const store of stores) {
      if (lastCheckInLookup?.[store.id]) {
        store.last_checkin = lastCheckInLookup[store.id];
      }
      if (
        storeLastCheckInDaysLookup?.[store.id] &&
        storeLastCheckInDaysLookup?.[store.id] >= 0
      ) {
        store.checkin_last_days = storeLastCheckInDaysLookup?.[store.id];
      }
    }
    console.log(`stores`, stores)
    setRouterStores(stores);
  }, [storeCheckInList, storeList]);

  const onPressRouters = () => {
    if (!routers) return;

    if (!routers) return;
    const options: Option[] = routers?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn tuyến',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        const router = find(routers, it => it.id === option.key);
        if (!router) return;
        setSelectedRouter(router);
      },
    });
  };

  const onPressItem = (item: TRouterTrackingStore) => {
    navigation.navigate(SCREEN.CLIENT_DETAIL, { id: item.id });
  };

  const renderItem: ListRenderItem<TRouterTrackingStore> = ({
    item,
    index,
  }) => {
    return (
      <RouterTrackingStoreItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const renderListHeader = () => {
    return (
      <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
        {selectedRouter?.name || ''}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Đi tuyến" />

      <View
        style={{ paddingVertical: 12, backgroundColor: colors.white, gap: 8 }}>
        <HStack style={{ paddingHorizontal: 16 }}>
          <HStack style={styles.router} onPress={onPressRouters}>
            <Text style={styles.routerName}>
              {selectedRouter?.name}{' '}
              {routerData?.store_ids?.length
                ? `(${routerData.store_ids.length})`
                : ''}
            </Text>
            <Image
              source={images.common.caretDown}
              tintColor={colors.primary}
              style={styles.changeRouterIcon}
            />
          </HStack>
          <HStack style={styles.mapBtn}>
            <Text style={styles.mapText}>{'Xem Map'}</Text>
            <Image source={images.route.mapOutlined} />
          </HStack>
        </HStack>
        <HStack style={styles.searchContainer}>
          <SearchBar
            style={styles.searchBar}
            onChangeText={setQuery}
            wait={500}
          />
        </HStack>
      </View>

      <FlashList
        data={routerStores}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetchRouterDetail}
        // ListHeaderComponent={renderListHeader}
        ListEmptyComponent={isRefetching ? null : <ListEmpty />}
      />
    </View>
  );
};

export default RouterTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    backgroundColor: colors.white,
  },
  filterBtn: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationBtn: {
    flex: 1,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
  },
  router: {
    flex: 1,
    gap: 8,
  },
  routerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  changeRouterIcon: {
    tintColor: colors.primary,
  },
  mapBtn: {
    flex: 0.5,
  },
  mapText: {
    flex: 1,
    textAlign: 'right',
    color: colors.primary,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.color161616,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  item: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});
