import { AnimatedCircularButton } from '@app/components/CircularButton';
import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpRoutePlan } from '@app/interfaces/entities/erp-route-plan.entity';
import { useRoutePlansList } from '@app/queries/route-plan.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { identity } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Calendar, ICalendarEventBase } from 'react-native-big-calendar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RoutePlanItem from './components/RoutePlanItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import ListEmpty from '@app/components/ListEmpty';
import { RoutePlansListFilter } from '@app/interfaces/query-params/route-plans-list.filter';

export type RoutePlanEvent = ICalendarEventBase & {};

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ROUTE_PLANS_LIST
>;

const RoutePlansListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [filter, setFilter] = useState<RoutePlansListFilter>({
    state: '2_approved',
  });
  const [query, setQuery] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const { data, isFetching, refetch } = useRoutePlansList({
    ...filter,
    query,
  });
  const [date, setDate] = useState(dayjs());

  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withTiming(isCalendarVisible ? 1 : 0, { duration: 200 });
  }, [isCalendarVisible]);

  const toggleCalendar = () => setIsCalendarVisible(!isCalendarVisible);

  const onNext = React.useCallback(() => setDate(date.add(1, 'month')), [date]);

  const onPrev = React.useCallback(
    () => setDate(date.add(-1, 'month')),
    [date],
  );
  const onToday = React.useCallback(() => setDate(dayjs()), []);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.ROUTE_PLANS_FILTER, {
      filter,
      onChange: setFilter,
    });
  };

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CREATE_ROUTE_PLAN, {});
  };

  const onPressItem = (data: ErpRoutePlan) => {
    navigation.navigate(SCREEN.ROUTE_PLAN_DETAIL, {
      id: data.id,
    });
  };

  const renderItem: ListRenderItem<ErpRoutePlan> = ({ item, index }) => {
    return (
      <RoutePlanItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const calendarContainerStyle = useAnimatedStyle(() => {
    return {
      zIndex: animValue.value ? 2 : 0,
      opacity: animValue.value,
    };
  });

  const events: RoutePlanEvent[] =
    data?.map(it => {
      return {
        title: [it.description, it.code].filter(identity).join(' '),
        start: dayjs(it.from_date, 'YYYY-MM-DD').toDate(),
        end: dayjs(it.to_date, 'YYYY-MM-DD').toDate(),
      };
    }) || [];

  return (
    <View style={styles.container}>
      <Header
        title="Kế hoạch đi tuyến"
        rightButtons={[
          {
            icon: images.common.calendarFilled,
            iconStyle: { tintColor: colors.white },
            onPress: () => toggleCalendar(),
          },
        ]}
      />

      <View style={styles.container}>
        <Animated.View
          onLayout={e => setCalendarHeight(e.nativeEvent.layout.height)}
          style={[styles.calendarContainer, calendarContainerStyle]}>
          <HStack style={styles.calendarHeader}>
            <Text style={styles.currentMonth}>
              {date.format('MMMM YYYY').toCapitalize()}
            </Text>
            <Touchable onPress={onPrev}>
              <Image
                source={images.common.chevronLeft}
                tintColor={colors.color161616}
              />
            </Touchable>
            <Touchable onPress={onNext}>
              <Image
                source={images.common.chevronRight}
                tintColor={colors.color161616}
              />
            </Touchable>
          </HStack>
          {calendarHeight > 0 && (
            <Calendar
              mode="month"
              height={calendarHeight}
              locale="vi"
              weekStartsOn={1}
              events={events}
              swipeEnabled={false}
              date={date.toDate()}
              moreLabel=""
              eventCellStyle={{ backgroundColor: colors.primary }}
              hideNowIndicator
              // maxVisibleEventCount={2}
            />
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
          estimatedItemSize={208}
          contentContainerStyle={styles.scrollContent}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={<ListEmpty />}
        />
      </View>

      <AnimatedCircularButton
        icon={images.common.add}
        style={[styles.btn, styles.createBtn]}
        onPress={onPressCreate}
      />
    </View>
  );
};

export default RoutePlansListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  calendarContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    backgroundColor: colors.white,
  },
  calendarHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
  },
  currentMonth: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
});
