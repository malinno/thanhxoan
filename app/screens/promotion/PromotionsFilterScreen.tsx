import Input from '@app/components/Input';
import RadioButtonGroup from '@app/components/RadioButtonGroup';
import { STOCK_INVENTORY_STATES } from '@app/constants/stock-inventory-states.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { StockInventoryState } from '@app/enums/stock-inventory-state.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { find, isNil } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PROMOTIONS_FILTER
>;

type PromotionsFilterViewModel = {
//   state?: [StockInventoryState, string];
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
};

const PromotionsFilterScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<PromotionsFilterViewModel>({});

//   useEffect(() => {
//     if (!route.params.filter) return;

//     const { state, from_date, to_date } = route.params.filter;

//     const initState = find(STOCK_INVENTORY_STATES, it => it.id === state);
//     if (!initState) return;

//     setFilter(preState => ({
//       ...preState,
//       state: [initState.id, initState.text],
//       from: from_date ? dayjs(from_date, 'YYYY-MM-DD') : undefined,
//       to: to_date ? dayjs(to_date, 'YYYY-MM-DD') : undefined,
//     }));
//   }, []);

//   const clearState = () =>
//     setFilter(preState => ({ ...preState, state: undefined }));

//   const clearDateRange = () =>
//     setFilter(preState => ({ ...preState, from: undefined, to: undefined }));

//   const onPressState = () => {
//     const options: Option[] = STOCK_INVENTORY_STATES?.map(it => ({
//       key: it.id,
//       text: it.text,
//     }));
//     SelectOptionModule.open({
//       title: 'Chọn trạng thái',
//       options,
//       onSelected: function (option: Option, data?: any): void {
//         const state = find(STOCK_INVENTORY_STATES, it => it.id === option.key);
//         if (!state) return;
//         setFilter(preState => ({ ...preState, state: [state.id, state.text] }));
//       },
//     });
//   };

//   const onPressCalendar = () => {
//     navigation.navigate(SCREEN.CALENDAR_RANGE_PICKER, {
//       fromDate: filter.from?.valueOf(),
//       toDate: filter.to?.valueOf(),
//       onChangeDateRange: (date: { fromDate: number; toDate: number }) => {
//         setFilter(preState => ({
//           ...preState,
//           from: dayjs(date.fromDate),
//           to: dayjs(date.toDate),
//         }));
//       },
//     });
//   };

//   const submit = () => {
//     route.params.onChange?.({
//       from_date: filter.from?.format('YYYY-MM-DD'),
//       to_date: filter.to?.format('YYYY-MM-DD'),
//     });
//     navigation.goBack();
//   };

  return (
    <View style={styles.container}>
      <Header title="Bộ lọc" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* <Input
          title="Trạng thái"
          placeholder="Dự thảo"
          style={[styles.input]}
          editable={false}
          rightButtons={[
            isNil(filter.state)
              ? { icon: images.common.chevronForward }
              : {
                  icon: images.common.close,
                  iconStyle: {
                    width: 16,
                    height: 16,
                    tintColor: colors.color6B7A90,
                  },
                  onPress: clearState,
                },
          ]}
          onPress={onPressState}
          value={filter.state?.[1]}
        /> */}

        {/* <Input
          title="Thời gian từ - đến"
          placeholder="Chọn khoảng thời gian"
          style={[styles.input]}
          editable={false}
          rightButtons={[
            isNil(filter.from)
              ? { icon: images.common.calendarFilled }
              : {
                  icon: images.common.close,
                  iconStyle: {
                    width: 16,
                    height: 16,
                    tintColor: colors.color6B7A90,
                  },
                  onPress: clearDateRange,
                },
          ]}
          onPress={onPressCalendar}
          value={
            filter.from && filter.to
              ? [
                  filter.from.format('DD/MM/YYYY'),
                  filter.to.format('DD/MM/YYYY'),
                ].join(' - ')
              : ''
          }
        /> */}
      </KeyboardAwareScrollView>
      {/* <View style={styles.footer}>
        <Button text="Tiếp theo" onPress={submit} />
      </View> */}
    </View>
  );
};

export default PromotionsFilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },

  input: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
