import HStack from '@app/components/HStack';
import {
  DEFAULT_LATITUDE_DELTA,
  DEFAULT_LONGITUDE_DELTA,
  DEFAULT_MAP_REGION,
} from '@app/constants/map.constant';
import { SCREEN } from '@app/enums/screen.enum';
import useGeolocation from '@app/hooks/useGeolocation';
import { ErpRouteSchedule } from '@app/interfaces/entities/erp-route-schedule.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  useRoutePlanDetail,
  useRouteSchedulesList,
} from '@app/queries/route-plan.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import PlaceUtils from '@core/utils/PlaceUtils';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import Animated, {
  FadeInDown,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RoutePlanScheduleItem, {
  RouteScheduleItemViewModel,
} from './components/RoutePlanScheduleItem';
import { findIndex, identity, omit } from 'lodash';
import PriceUtils from '@core/utils/PriceUtils';
import { getDistance } from 'geolib';
import FastImage from 'react-native-fast-image';
import ListEmpty from '@app/components/ListEmpty';
import { AnimatedCircularButton } from '@app/components/CircularButton';
import dayjs from 'dayjs';
import { RouteSchedulesFilter } from '@app/interfaces/query-params/route-schedules.filter';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';

type TCurrentPosition = Region & {
  address?: string;
};

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ROUTE_PLAN_SCHEDULES_LIST
>;

type RouteScheduleGroup = {
  date: string;
  data: RouteScheduleItemViewModel[];
};

const RoutePlanSchedulesListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const mapView = useRef<MapView>(null);

  const [query, setQuery] = useState('');
  const [data, setData] = useState<(string | RouteScheduleItemViewModel)[]>([]);
  const [filter, setFilter] = useState<RouteSchedulesFilter>({});
  const [isMapEnabled, setIsMapEnabled] = useState(false);
  const [currentPosition, setCurrentPosition] =
    useState<TCurrentPosition>(DEFAULT_MAP_REGION);
  const [isFetchingStringLocation, setIsFetchingStringLocation] =
    useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ErpRouteSchedule>();

  useEffect(() => {
    if (route.params?.filter?.from_date)
      setFilter(preState => ({
        ...preState,
        from_date: route.params.filter?.from_date,
      }));
    if (route.params?.filter?.to_date)
      setFilter(preState => ({
        ...preState,
        to_date: route.params.filter?.to_date,
      }));
  }, [route.params?.filter]);

  const {
    geolocation,
    isFetching: isFetchingCurrentPosition,
    error: geolocationError,
  } = useGeolocation(false);
  const { data: plan } = useRoutePlanDetail(
    route.params?.filter?.router_plan_id,
  );
  const {
    data: schedules,
    isLoading,
    isRefetching,
    refetch,
  } = useRouteSchedulesList({
    ...route.params?.filter,
    ...filter,
    query,
  });

  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withTiming(isMapEnabled ? 1 : 0, { duration: 200 });
  }, [isMapEnabled]);

  useEffect(() => {
    if (!geolocation) return;

    const getStrAddr = async () => {
      setIsFetchingStringLocation(true);
      PlaceUtils.location2String(
        geolocation.coords.latitude,
        geolocation.coords.longitude,
      )
        .then(addr =>
          setCurrentPosition(state => ({
            ...state,
            address: addr,
            latitude: geolocation.coords.latitude,
            longitude: geolocation.coords.longitude,
          })),
        )
        .catch(err => console.log(`cannot parse location to string`, err))
        .finally(() => setIsFetchingStringLocation(false));
    };

    getStrAddr();

    setCurrentPosition(state => ({
      ...state,
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
    }));
  }, [geolocation]);

  useEffect(() => {
    if (!schedules) {
      setData([]);
      return;
    }

    const sections = schedules
      .reduce((prev: RouteScheduleGroup[], it) => {
        const item: RouteScheduleItemViewModel = {
          ...it,
          distance: (() => {
            if (
              !it?.store_id?.partner_latitude ||
              !it?.store_id?.partner_longitude ||
              !geolocation?.coords
            )
              return 'Chưa xác định';
            const distance = getDistance(geolocation.coords, {
              latitude: it.store_id.partner_latitude,
              longitude: it.store_id.partner_longitude,
            });
            return PriceUtils.format(distance, 'm');
          })(),
        };

        const idx = findIndex(prev, s => s.date === it.from_date);
        if (idx < 0) {
          prev.push({
            date: it.from_date,
            data: [item],
          });
          return prev;
        }
        prev[idx].data?.push(item);
        return prev;
      }, [])
      .sort((a, b) =>
        dayjs(a.date, 'YYYY-MM-DD').diff(dayjs(b.date, 'YYYY-MM-DD')),
      );

    setData(
      sections.reduce((pre: (string | RouteScheduleItemViewModel)[], sect) => {
        pre.push(sect.date);
        pre.push(...sect.data);
        return pre;
      }, []),
    );
  }, [schedules, geolocation]);

  useEffect(() => {
    console.log(`selected store`, selectedSchedule?.store_id);
    if (
      selectedSchedule?.store_id?.partner_latitude &&
      selectedSchedule?.store_id?.partner_longitude
    )
      mapView.current?.animateCamera({
        center: {
          latitude: selectedSchedule?.store_id?.partner_latitude,
          longitude: selectedSchedule?.store_id?.partner_longitude,
        },
        pitch: 1,
        heading: 10,
        zoom: 16,
      });
  }, [selectedSchedule]);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.ROUTE_SCHEDULES_FILTER, {
      filter,
      onChange: setFilter,
    });
  };

  const onPressCreate = () => {
    const routePlanId = plan?.id || route.params.filter?.router_plan_id;

    navigation.navigate(SCREEN.CREATE_ROUTE_SCHEDULE, {
      routePlanId,
    });
  };

  const toggleMap = () => setIsMapEnabled(!isMapEnabled);

  const onPressItem = (item: ErpRouteSchedule) => {
    navigation.navigate(SCREEN.CHECK_IN_OUT_HISTORIES, {
      filter: {
        store_id: item.store_id.id,
        router_plan_id: item.router_plan_id?.[0],
        detail_router_plan_id: item.id,
        category: CheckInOutCategory.working_route,
      },
    });
  };

  const renderListHeader = () => {
    return (
      <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
        Danh sách NPP/Đại lý {schedules?.length ? `(${schedules?.length})` : ''}
      </Text>
    );
  };

  const renderItem: ListRenderItem<string | ErpRouteSchedule> = ({
    item,
    index,
  }) => {
    if (typeof item === 'string')
      return (
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.color161616,
            }}>
            Ngày {dayjs(item, 'YYYY-MM-DD').format('DD/MM/YYYY')}
          </Text>
        </View>
      );
    return (
      <RoutePlanScheduleItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const routeName = plan?.router_id?.[1] ?? 'Lịch trình tuyến';
  const mapStyle = useAnimatedStyle(() => {
    return {
      zIndex: animValue.value ? 2 : 0,
      opacity: animValue.value,
    };
  });

  return (
    <View style={styles.container}>
      <Header
        title={routeName}
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />

      <HStack style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <HStack style={styles.locationBtn}>
          <Image source={images.route.pinAlt} />
          <Text numberOfLines={1} style={styles.locationText}>
            {isFetchingCurrentPosition || isFetchingStringLocation
              ? 'Đang xác định vị trí ...'
              : currentPosition?.address}
          </Text>
        </HStack>
        <HStack style={styles.mapBtn} onPress={toggleMap}>
          <Text style={styles.mapText}>
            {isMapEnabled ? 'Ẩn map' : 'Xem Map'}
          </Text>
          <Image source={images.route.mapOutlined} />
        </HStack>
      </HStack>

      <View style={styles.container}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: 0 }, mapStyle]}>
          <MapView
            ref={mapView}
            style={StyleSheet.absoluteFill}
            region={currentPosition}
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton
            showsUserLocation
            tintColor={colors.primary}>
            {data?.map(r => {
              if (typeof r === 'string' || !r.store_id?.partner_latitude)
                return null;
              const _onPress = () => setSelectedSchedule(r);
              return (
                <Marker
                  key={r.id}
                  onPress={_onPress}
                  coordinate={{
                    latitude: r.store_id?.partner_latitude,
                    longitude: r.store_id?.partner_longitude,
                  }}>
                  <Image
                    source={
                      r.checkin_status === 'checked'
                        ? images.route.storeYellow
                        : images.route.storeRed
                    }
                  />
                </Marker>
              );
            })}
          </MapView>
          {!!selectedSchedule && (
            <HStack
              entering={SlideInDown}
              style={{
                ...StyleSheet.absoluteFillObject,
                top: undefined,
                backgroundColor: colors.white,
                paddingVertical: 24,
                paddingHorizontal: 16,
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  width: 130,
                  height: 100,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.white,
                  marginRight: 12,
                  backgroundColor: colors.colorF0F3F4,
                }}>
                <FastImage
                  source={{
                    uri: Boolean(selectedSchedule?.store_id?.image_url)
                      ? selectedSchedule?.store_id?.image_url
                      : undefined,
                  }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <HStack style={styles.row}>
                  <Image
                    source={images.client.store}
                    style={styles.rowIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.rowText}>
                    {selectedSchedule.store_id?.name}
                  </Text>
                </HStack>
                <HStack style={styles.row}>
                  <Image
                    source={images.client.location}
                    style={styles.rowIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.rowText}>
                    {[
                      selectedSchedule.store_id?.street2,
                      selectedSchedule.address_town_id?.[1],
                      selectedSchedule.address_district_id?.[1],
                      selectedSchedule.address_state_id?.[1],
                    ]
                      .filter(identity)
                      .join(', ')}
                  </Text>
                </HStack>
                <HStack style={styles.row}>
                  <Image
                    source={images.client.call}
                    style={styles.rowIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.rowText}>
                    {selectedSchedule.store_id?.representative ||
                      selectedSchedule.store_id?.name}{' '}
                    - {selectedSchedule.store_id?.phone}
                  </Text>
                </HStack>
                <HStack style={styles.row}>
                  <Image
                    source={images.client.login}
                    style={styles.rowIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.rowText}>
                    Check in: {selectedSchedule?.checkin_last_days} ngày trước
                  </Text>
                </HStack>
                <HStack style={styles.row}>
                  <Image
                    source={images.client.documentText}
                    style={styles.rowIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.rowText}>
                    {selectedSchedule.store_id?.total_orders} Đơn hàng
                  </Text>
                </HStack>
              </View>
            </HStack>
          )}
        </Animated.View>

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
          data={data}
          renderItem={renderItem}
          estimatedItemSize={120}
          contentContainerStyle={styles.scrollContent}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={<ListEmpty />}
        />
      </View>

      {/* <AnimatedCircularButton
        icon={images.common.add}
        style={[styles.btn, styles.createBtn]}
        onPress={onPressCreate}
      /> */}
    </View>
  );
};

export default RoutePlanSchedulesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingBottom: 12,
    backgroundColor: colors.white,
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
  locationBtn: {
    flex: 1,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
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
  btn: {
    position: 'absolute',
    right: 16,
  },
  createBtn: {
    bottom: 28,
  },
  row: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  rowIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  rowText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
  },
});
