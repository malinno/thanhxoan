import { Image, StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import Header from '@core/components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import { StackActions, useNavigation } from '@react-navigation/native';
import images from '@images';
import Text from '@core/components/Text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import HStack from '@app/components/HStack';
import { colors } from '@core/constants/colors.constant';
import { useProductDetail, useProducts } from '@app/queries/product.query';
import Input from '@app/components/Input';
import QuantityAdjustment from '@app/components/QuantityAdjustment';
import Button from '@core/components/Button';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import DatePickerSheet from '@core/components/DatePickerSheet';
import dayjs from 'dayjs';
import {
  createStockInventoryLineMutation,
  editStockInventoryLineMutation,
} from '@app/queries/stock-inventory.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { useAuth } from '@app/hooks/useAuth';
import { queryClient } from 'App';
import { useStockInventoryLines } from '@app/queries/stock-inventory.query';
import { isNil } from 'lodash';

type StocktakingFormViewModel = {
  id?: string | number;
  lot?: string;
  countQty: string;
  expiryDate?: dayjs.Dayjs;
  note?: string;
};

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.STOCKTAKING>;

const StocktakingScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const createMutation = createStockInventoryLineMutation();
  const editMutation = editStockInventoryLineMutation();

  const { data: product } = useProductDetail(route.params.productId);
  const { data: lines } = useStockInventoryLines(
    route.params.id,
    { product_id: route.params.productId },
    !isNil(route.params.lineId),
  );

  const [data, setData] = useState<StocktakingFormViewModel>({
    id: route.params.lineId,
    countQty: '0',
  });

  useEffect(() => {
    if (createMutation.isPending || editMutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [createMutation.isPending, editMutation.isPending]);

  useEffect(() => {
    const line = lines?.find(l => l.id === route.params.lineId);
    if (line) {
      setData(preState => ({
        ...preState,
        id: line.id,
        lot: line.lot_id?.[1],
        expiryDate: line.expiry_date
          ? dayjs(line.expiry_date, 'YYYY-MM-DD')
          : undefined,
        countQty: String(line.count_qty),
        note: line.note ? String(line.note) : undefined,
      }));
    }
  }, [lines, route.params.lineId]);

  const onChangeLot = (lot: string) =>
    setData(preState => ({ ...preState, lot }));

  const onChangeNote = (note: string) =>
    setData(preState => ({ ...preState, note }));

  const onChangeCount = (countQty: string) =>
    setData(preState => ({ ...preState, countQty }));

  const onPressExpiryDate = () => {
    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Hạn sử dụng',
        renderContent: () => {
          return (
            <DatePickerSheet
              mode="date"
              minimumDate={new Date()}
              date={data?.expiryDate?.valueOf() || dayjs().valueOf()}
              onSelected={(date: number) => {
                setData(preState => ({ ...preState, expiryDate: dayjs(date) }));
                Popup.hide();
              }}
            />
          );
        },
      },
    });
  };

  const create = async () => {
    if (!user) return;
    const now = dayjs();

    createMutation
      .mutateAsync({
        create_uid: user.id,
        inventory_id: Number(route.params.id),
        product_id: Number(route.params.productId),
        inventory_date: now.format('YYYY-MM-DD'),
        count_qty: parseFloat(data.countQty),
        note: data.note,
        expiry_date: data.expiryDate
          ? data.expiryDate.format('YYYY-MM-DD')
          : undefined,
        lot_id: data.lot,
      })
      .then(({ response }) => {
        const result = response.result?.records?.[0];
        if (!result) return;

        queryClient.refetchQueries({
          queryKey: ['stock-inventory-lines'],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const edit = async () => {
    if (!user || !data.id) return;

    editMutation
      .mutateAsync({
        id: data.id,
        data: {
          update_uid: user.id,
          count_qty: parseFloat(data.countQty),
          note: data.note,
          expiry_date: data.expiryDate
            ? data.expiryDate.format('YYYY-MM-DD')
            : undefined,
          lot_id: data.lot,
        },
      })
      .then(({ response }) => {
        const result = response.result?.records?.[0];
        if (!result) return;

        queryClient.refetchQueries({
          queryKey: ['stock-inventory-lines'],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const save = () => {
    if (!data.id) {
      create();
      return;
    }

    edit();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Cập nhật tồn kho"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.product}>
          <Text style={styles.productName}>{product?.name}</Text>
          <HStack style={styles.barcode}>
            <Image source={images.common.barcode} tintColor={colors.primary} />
            <Text style={styles.barcodeText}>{product?.barcode}</Text>
          </HStack>
        </View>

        <HStack style={{ paddingHorizontal: 16, gap: 16 }}>
          <Input
            style={{ flex: 0.5 }}
            title="Số lô"
            placeholder="01042024"
            value={data.lot}
            onChangeText={onChangeLot}
          />
          <Input
            editable={false}
            style={{ flex: 1 }}
            title="Hạn sử dụng"
            placeholder="01/04/2026"
            rightButtons={[{ icon: images.common.calendarFilled }]}
            value={data.expiryDate?.format('DD/MM/YYYY')}
            onPress={onPressExpiryDate}
          />
        </HStack>

        <HStack style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Text style={{ flex: 1 }}>Số lượng thực tế</Text>
          <QuantityAdjustment
            value={String(data.countQty)}
            onChangeText={onChangeCount}
          />
        </HStack>

        <Input
          title="Ghi chú sản phẩm"
          placeholder="Khu vực B1"
          style={{ marginHorizontal: 16 }}
          inputStyle={styles.note}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          value={data.note}
          onChangeText={onChangeNote}
        />
      </KeyboardAwareScrollView>
      <Button text="Lưu" style={styles.button} onPress={save} />
    </View>
  );
};

export default StocktakingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: 16,
  },
  product: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.colorEFF0F4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  barcode: {
    marginTop: 8,
  },
  barcodeText: {
    flex: 1,
    marginLeft: 8,
    color: colors.color161616,
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  note: {
    height: 80,
  },
});
