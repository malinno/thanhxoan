import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import Section from '@app/components/Section';
import { DISPLAY_INTERVAL_TYPE } from '@app/constants/erp-interval-type.constant';
import { ROUTE_PLAN_CATEGORIES } from '@app/constants/route-plan-categories.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { useRoutePlanForm } from '@app/hooks/useRoutePlanForm';
import { IntervalType } from '@app/interfaces/entities/erp-route-plan.entity';
import { useBusinessStates } from '@app/queries/customer.query';
import { useRouterDetail, useRoutersList } from '@app/queries/erp-router.query';
import Checkbox from '@core/components/Checkbox';
import DatePickerSheet from '@core/components/DatePickerSheet';
import Text from '@core/components/Text';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { find, isEmpty, isNil } from 'lodash';
import React, { Fragment, useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import RoutePlanStateItem from './RoutePlanStateItem';
import { ExtendedOption } from '@app/screens/common/MultiSelectScreen';

const RoutePlanPageOne = () => {
  const navigation = useNavigation();

  const data = useRoutePlanForm(state => state.data);
  const setData = useRoutePlanForm(state => state.setData);
  const errors = useRoutePlanForm(state => state.errors);

  const { data: states } = useBusinessStates();
  const { data: routers } = useRoutersList();
  const { data: routerData } = useRouterDetail(data.router?.[0]);

  useEffect(() => {
    if (data.editable) {
      setData({ stores: routerData?.store_ids });
    }
  }, [routerData, data.editable]);

  useEffect(() => {
    if (data.editable && !isNil(routerData?.day_of_week)) {
      const today = dayjs();
      const yesterday = today.subtract(1, 'day');
      let dayOfWeek = today
        .startOf('week')
        .add(Number(routerData.day_of_week), 'days');
      console.log(`day_of_week`, routerData.day_of_week);
      console.log(`yesterday`, yesterday);
      console.log(`dayOfWeek`, dayOfWeek);
      if (dayOfWeek.isBefore(yesterday)) {
        dayOfWeek = dayOfWeek.add(1, 'week');
      }

      setData({
        from: dayOfWeek,
        to: dayOfWeek,
      });
    }
  }, [routerData]);

  useEffect(() => {
    if (!data.recurrent) {
      setData({
        intervalNumber: undefined,
        intervalType: undefined,
        recurrentDate: undefined,
      });
    }
  }, [data.recurrent]);

  const onChangeDescription = (description: string) => setData({ description });

  const onChangeIntervalNumber = (intervalNumber: string) =>
    setData({ intervalNumber });

  const toggleRecurrent = () => {
    if (!data.editable) return;

    setData({ recurrent: !data.recurrent });
  };

  const onPressCategories = () => {
    if (!data.editable) return;

    const options: Option[] = ROUTE_PLAN_CATEGORIES?.map(it => ({
      key: it.id,
      text: it.text,
    }));
    SelectOptionModule.open({
      title: 'Chọn phân loại',
      options,
      onSelected: function (option: Option, data?: any): void {
        const category = find(
          ROUTE_PLAN_CATEGORIES,
          it => it.id === option.key,
        );
        if (!category) return;
        setData({ category: [category.id, category.text] });
      },
    });
  };

  const onPressCalendar = () => {
    if (!data.editable) return;
    navigation.navigate(SCREEN.CALENDAR_RANGE_PICKER, {
      fromDate: data.from.valueOf(),
      toDate: data.to.valueOf(),
      onChangeDateRange: (date: { fromDate: number; toDate: number }) => {
        setData({
          from: dayjs(date.fromDate),
          to: dayjs(date.toDate),
        });
      },
    });
  };

  const onPressIntervalTypes = async () => {
    if (!data.editable) return;

    const options: Option[] = Object.entries(DISPLAY_INTERVAL_TYPE)?.map(
      it => ({
        key: it[0],
        text: it[1].toCapitalize(),
      }),
    );
    SelectOptionModule.open({
      title: 'Chọn loại lặp',
      options,
      onSelected: function (option: Option, data?: any): void {
        setData({ intervalType: option.key as IntervalType });
      },
    });
  };

  const onPressRecurrentDate = () => {
    if (!data.editable) return;
    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Lặp lại đến ngày',
        renderContent: () => {
          return (
            <DatePickerSheet
              mode="date"
              minimumDate={new Date()}
              date={data?.recurrentDate?.valueOf() || dayjs().valueOf()}
              onSelected={(date: number) => {
                setData({ recurrentDate: dayjs(date) });
                Popup.hide();
              }}
            />
          );
        },
      },
    });
  };

  const onPressRouters = () => {
    if (!data.editable) return;

    if (!routers) return;
    const options: Option[] = routers?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn tuyến',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option): void {
        const router = find(routers, it => it.id === option.key);
        if (!router) return;
        setData({ router: [router.id, router.name], description: router.name });
      },
    });
  };

  const onPressStates = () => {
    if (!data.editable) return;

    if (!states) return;
    const options: ExtendedOption[] = states?.map(it => ({
      key: it.id,
      text: it.name,
      isSelected: Boolean(data.states?.find(st => st[0] === it.id)),
    }));
    navigation.navigate(SCREEN.MULTI_SELECT, {
      title: 'Chọn tỉnh/ thành phố',
      options,
      onSelected: (opts: Option[]) => {
        setData({ states: opts.map(o => [Number(o.key), o.text]) });
      },
    });
  };

  const onPressRemoveStateItem = (index: number) => {
    if (!data.editable) return;

    setData({ states: data.states?.filter((_, idx) => idx !== index) });
  };

  const intervalType = data?.intervalType
    ? DISPLAY_INTERVAL_TYPE[data?.intervalType]
    : '';

  const recurrent = data?.recurrentDate
    ? dayjs(data?.recurrentDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
    : '';

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section title="Thông tin tuyến bán hàng" bodyComponent={Fragment}>
          <Input
            editable={false}
            style={[styles.input, { marginTop: 0 }]}
            title="Tên tuyến"
            placeholder="Tuyến Hà đông - Nam từ liêm"
            rightButtons={[{ icon: images.common.chevronForward }]}
            value={data?.router?.[1]}
            onPress={onPressRouters}
            error={errors?.router}
          />

          <Input
            editable={false}
            style={[styles.input]}
            title="Phân loại"
            placeholder="Kế hoạch theo tuyến"
            rightButtons={[{ icon: images.common.chevronForward }]}
            value={data?.category?.[1]}
            onPress={onPressCategories}
            error={errors?.category}
          />

          <Input
            style={[styles.input]}
            title="Tên kế hoạch"
            placeholder="Thứ hai"
            value={data?.description}
            onChangeText={onChangeDescription}
            error={errors?.description}
            editable={data.editable}
          />

          {!isNil(data?.category?.[0]) && data.category[0] === 'audit' && (
            <Input
              editable={false}
              style={[styles.input]}
              title="Tỉnh/ thành phố"
              placeholder="TP. Hà Nội"
              rightButtons={[{ icon: images.common.chevronForward }]}
              onPress={onPressStates}
              renderContent={
                <View style={styles.statesContainer}>
                  {isEmpty(data?.states) ? (
                    <Text style={styles.placeholderText}>TP. Hà Nội</Text>
                  ) : (
                    data?.states?.map((state, index) => {
                      return (
                        <RoutePlanStateItem
                          key={state[0]}
                          index={index}
                          data={state}
                          onRemove={onPressRemoveStateItem}
                          removable={data.editable}
                        />
                      );
                    })
                  )}
                </View>
              }
            />
          )}

          <Input
            style={styles.input}
            title="Nhân viên phụ trách"
            rightButtons={[{ icon: images.common.chevronForward }]}
            value={data?.userId?.[1] || ''}
            disabled
            editable={false}
          />

          <Input
            style={styles.input}
            title="Đội ngũ bán hàng"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled
            value={data?.teamId?.[1] || ''}
          />

          <Input
            style={styles.input}
            title="Công ty con"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled
            value={data?.groupId?.[1] || ''}
          />
        </Section>

        <Section
          title="Kế hoạch"
          bodyComponent={Fragment}
          style={{ paddingTop: 0 }}>
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Từ ngày - đến ngày"
            editable={false}
            rightButtons={[{ icon: images.common.calendarFilled }]}
            value={[
              data.from.format('DD/MM/YYYY'),
              data.to.format('DD/MM/YYYY'),
            ].join(' - ')}
            onPress={onPressCalendar}
          />
          <HStack style={styles.interval}>
            <HStack style={{ flex: 1, alignSelf: 'center' }}>
              <Checkbox
                disabled={!data.editable}
                value={data?.recurrent}
                iconStyle={styles.checkboxIcon}
                disableBuiltInState
                textComponent={<Text style={styles.recurrent}>Lặp lại</Text>}
                onPress={toggleRecurrent}
              />
            </HStack>
            <Input
              style={[{ flex: 1 }, !data.recurrent && { opacity: 0 }]}
              title="Lặp lại mỗi"
              placeholder="7"
              value={data?.intervalNumber}
              onChangeText={onChangeIntervalNumber}
              editable={data.editable}
              keyboardType="numeric"
              disabled={!data.recurrent}
              error={errors?.intervalNumber}
              hideErrorText
            />
            <Input
              style={[{ flex: 1 }, !data.recurrent && { opacity: 0 }]}
              title="Loại lặp"
              placeholder="Ngày"
              value={intervalType.toCapitalize()}
              rightButtons={[
                {
                  icon: images.common.chevronForward,
                  style: { paddingRight: 12, paddingLeft: 0 },
                },
              ]}
              editable={false}
              onPress={onPressIntervalTypes}
              disabled={!data.recurrent}
              error={errors?.intervalType}
              hideErrorText
            />
          </HStack>
          {!!data.recurrent && (
            <Input
              style={[styles.input]}
              title="Lặp lại đến ngày"
              placeholder="03/05/2024"
              rightButtons={[{ icon: images.common.calendarFilled }]}
              editable={false}
              value={recurrent}
              onPress={onPressRecurrentDate}
              error={errors?.recurrentDate}
            />
          )}
        </Section>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RoutePlanPageOne;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: 16,
  },
  input: {},
  interval: {
    gap: 16,
  },
  checkboxIcon: {
    borderRadius: 4,
  },
  recurrent: {
    marginLeft: 8,
    color: colors.color161616,
  },
  statesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color22222280,
    lineHeight: 20,
    marginTop: 6,
  },
});
