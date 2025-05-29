import Input from '@app/components/Input';
import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerDetail, useCustomers } from '@app/queries/customer.query';
import {
  createStockInventoryMutation,
  editStockInventoryMutation,
} from '@app/queries/stock-inventory.mutation';
import { useStockInventoryDetail } from '@app/queries/stock-inventory.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { find } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type StockSheetViewModel = {
  id?: number | string;
  store?: [number, string];
  content?: string;
  userId?: [number, string];
  date: dayjs.Dayjs;
};

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.STOCK_INVENTORY_FORM
>;

const StockInventoryFormScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const createMutation = createStockInventoryMutation();
  const editMutation = editStockInventoryMutation();

  // const { data: stores } = useCustomers(undefined, false);
  const { data: agency } = useCustomerDetail(route.params.agencyId);
  const {
    data: stockInventory,
    isLoading: isFetchingStockInventory,
    refetch: refetchStockInventory,
  } = useStockInventoryDetail(route.params.id);

  const [data, setData] = useState<StockSheetViewModel>({
    id: route.params.id,
    userId: user ? [user?.id, user?.name] : undefined,
    date: dayjs(),
  });

  useEffect(() => {
    if (createMutation.isPending || editMutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [createMutation.isPending, editMutation.isPending]);

  useEffect(() => {
    if (stockInventory)
      setData({
        id: stockInventory?.id,
        store: stockInventory?.agency_id,
        content: stockInventory?.content ?? '',
        userId: stockInventory?.user_id,
        date: dayjs(stockInventory?.start_date, 'YYYY-MM-DD'),
      });
  }, [stockInventory]);

  useEffect(() => {
    if (agency)
      setData(preState => ({
        ...preState,
        store: [agency.id, agency.name],
      }));
  }, [agency]);

  const onChangeContent = (content: string) =>
    setData(preState => ({ ...preState, content }));

  // const onPressStores = () => {
  //   if (!stores) return;
  //   const options: Option[] = stores?.map(it => ({
  //     key: it.id,
  //     text: it.name,
  //   }));
  //   SelectOptionModule.open({
  //     title: 'Chọn cửa hàng',
  //     options,
  //     onSelected: function (option: Option, data?: any): void {
  //       const store = find(stores, it => it.id === option.key);
  //       if (!store) return;
  //       setData(preState => ({ ...preState, store: [store.id, store.name] }));
  //     },
  //   });
  // };

  const onPressStores = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      title: 'Chọn cửa hàng',
      selectedIds: data.store ? [data.store[0]] : undefined,
      onSelected: (customers: ErpCustomer[]) => {
        const store = customers[0]
        if (!store) return;
        setData(preState => ({ ...preState, store: [store.id, store.name] }));
      },
    });
  };

  const validate = () => {
    return true;
  };

  const create = async () => {
    if (!user) return;

    createMutation
      .mutateAsync({
        create_uid: user.id,
        agency_id: data.store?.[0],
        start_date: data.date?.format('YYYY-MM-DD'),
        user_id: data.userId?.[0],
        content: data.content,
        checkin_out_id: route.params.checkInOutId
          ? Number(route.params.checkInOutId)
          : undefined,
      })
      .then(({ response }) => {
        const result = response.result?.showcase_declaration?.[0];
        if (!result) return;

        queryClient.refetchQueries({
          queryKey: ['stock-inventory-list'],
        });
        navigation.dispatch(
          StackActions.replace(SCREEN.STOCK_INVENTORY_PRODUCTS, {
            id: result.id,
          }),
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const edit = async () => {
    if (!user || !data.id) return;

    navigation.navigate(SCREEN.STOCK_INVENTORY_PRODUCTS, { id: data.id });

    // editMutation
    //   .mutateAsync({
    //     id: data.id,
    //     data: {
    //       update_uid: user.id,
    //       agency_id: data.store?.[0],
    //       start_date: data.date?.format('YYYY-MM-DD'),
    //       user_id: data.userId?.[0],
    //       content: data.content,
    //     },
    //   })
    //   .then(({ response }) => {
    //     const result = response.result?.showcase_declaration?.[0];
    //     if (!result) return;

    //     queryClient.invalidateQueries({
    //       queryKey: ['stock-inventory-list'],
    //     });
    //     navigation.dispatch(
    //       StackActions.replace(SCREEN.STOCK_INVENTORY_PRODUCTS, {
    //         id: result.id,
    //       }),
    //     );
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  const submit = () => {
    if (!validate()) return;

    if (!data.id) {
      create();
      return;
    }

    edit();
  };

  return (
    <View style={styles.container}>
      <Header title="Kiểm kê tồn kho" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section title="Thông tin kiểm hàng" bodyComponent={React.Fragment}>
          <Input
            title="NPP/ Đại lý"
            placeholder="NPP Anh Sơn"
            editable={false}
            style={[styles.input, { marginTop: 0 }]}
            numberOfLines={1}
            rightButtons={[{ icon: images.common.chevronForward }]}
            value={data.store?.[1]}
            onPress={onPressStores}
          />
          <Input
            title="Nội dung kiểm kho"
            placeholder="Kiểm kê tồn định kỳ"
            style={[styles.input]}
            numberOfLines={1}
            value={data.content}
            onChangeText={onChangeContent}
          />
          <Input
            title="Nhân viên phụ trách"
            placeholder="Nhân viên kinh doanh"
            disabled
            style={styles.input}
            numberOfLines={1}
            rightButtons={[{ icon: images.common.chevronForward }]}
            value={data.userId?.[1]}
          />
          <Input
            style={[styles.input]}
            title="Ngày kiểm kho"
            placeholder="03/05/2024"
            rightButtons={[{ icon: images.common.calendarFilled }]}
            editable={false}
            value={data.date.format('DD/MM/YYYY')}
          />
        </Section>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text="Lưu và sang bước tiếp theo" onPress={submit} />
      </View>
    </View>
  );
};

export default StockInventoryFormScreen;

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
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
