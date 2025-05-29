import Input from '@app/components/Input';
import Section from '@app/components/Section';
import {
  JOURNAL_TYPES,
  JOURNAL_TYPE_MAPPING,
} from '@app/constants/journal-types.constant';
import {
  SHIPPING_ADDRESS_TYPES,
  SHIPPING_ADDRESS_TYPE_MAPPING,
} from '@app/constants/shipping-address.constant';
import { JournalType } from '@app/enums/journal-type.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { ShippingAddressType } from '@app/enums/shipping-address-type.enum';
import { TDeliveryAddress } from '@app/hooks/usePosOrderForm';
import { useSaleOrderForm } from '@app/hooks/useSaleOrderForm';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpWarehouse } from '@app/interfaces/entities/erp-warehouse.entity';
import { useCrmGroups } from '@app/queries/crm-group.query';
import { useCustomerContacts } from '@app/queries/customer.query';
import { useProductPriceList } from '@app/queries/product.query';
import { useWarehouses } from '@app/queries/warehouse.query';
import Button from '@core/components/Button';
import DatePickerSheet from '@core/components/DatePickerSheet';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { identity, isEmpty } from 'lodash';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface Props {
  next?: () => void;
  previous?: () => void;
}

const SaleOrderFormStepOne: FC<Props> = ({ next, previous, ...props }) => {
  const navigation = useNavigation();

  const data = useSaleOrderForm(state => state.data);
  const setData = useSaleOrderForm(state => state.setData);
  const errors = useSaleOrderForm(state => state.errors);
  const setErrors = useSaleOrderForm(state => state.setErrors);

  const { data: crmGroups } = useCrmGroups();
  const { data: stockWarehouses } = useWarehouses();
  const { data: partnerContacts } = useCustomerContacts(data.partner?.id);
  const { data: priceList, refetch: refetchPriceList } = useProductPriceList(
    { partner_id: data.partner?.id },
    false,
  );

  const [warehouses, setWarehouses] = useState<ErpWarehouse[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    TDeliveryAddress[]
  >([]);

  useEffect(() => {
    if (data.partner?.id) refetchPriceList();
  }, [data.partner]);

  useEffect(() => {
    const wh = stockWarehouses ? stockWarehouses : [];
    setWarehouses(wh);

    if (wh?.[0] && !data.warehouse)
      setData({ warehouse: [wh[0].id, wh[0].name] });
  }, [stockWarehouses]);

  useEffect(() => {
    if (priceList?.[0] && !data.priceList)
      setData({ priceList: [priceList[0].id, priceList[0].name] });
  }, [priceList]);

  useEffect(() => {
    const addresses: TDeliveryAddress[] = [];

    if (data.partner) {
      addresses.push({
        id: data.partner.id,
        receiverName: data.partner.name,
        phone: data.partner.phone,
        addressDetail: data.partner.street2,
      });
    }

    if (partnerContacts) {
      for (const item of partnerContacts) {
        addresses.push({
          id: item.id,
          receiverName: item.name,
          phone: item.phone,
          addressDetail: [
            item.street2,
            item.address_town_id[1],
            item.address_district_id[1],
            item.address_state_id[1],
          ]
            .filter(identity)
            .join(', '),
        });
      }
    }

    setDeliveryAddresses(addresses);
  }, [partnerContacts, data.partner]);

  const onChangeSaleNote = (saleNote: string) => setData({ saleNote });

  const onPressPartners = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      filter: {
        category: 'distributor',
      },
      title: 'Chọn khách hàng',
      selectedIds: data.partner?.id ? [data.partner?.id] : undefined,
      onSelected: (customers: ErpCustomer[]) => {
        const customer = customers[0];
        if (customer.id === data.partner?.id) return;
        setData({
          partner: customer,
          deliveryAddress: customer
            ? {
                id: customer.id,
                receiverName: customer.name,
                phone: customer.phone,
                addressDetail: customer.street2,
              }
            : undefined,
        });
      },
    });
  };

  const onPressDeliveryAddresses = () => {
    if (!deliveryAddresses) return;
    const options: Option[] = deliveryAddresses?.map(it => ({
      key: Number(it.id),
      text: String(it.receiverName),
    }));
    SelectOptionModule.open({
      title: 'Chọn người nhận',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option): void {
        const address = deliveryAddresses.find(
          it => it.id === Number(option.key),
        );
        setData({ deliveryAddress: address });
      },
    });
  };

  const onPressCrmGroups = () => {
    if (!crmGroups) return;
    const options: Option[] = crmGroups?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn bên bán',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option): void {
        setData({ crmGroup: [Number(option.key), option.text] });
      },
    });
  };

  const onPressWarehouses = () => {
    if (!warehouses) return;
    const options: Option[] = warehouses?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn kho xuất hàng',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({ warehouse: [Number(option.key), option.text] });
      },
    });
  };

  const onPressPriceList = () => {
    if (!priceList) return;
    const options: Option[] = priceList?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn bảng giá',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({ priceList: [Number(option.key), option.text] });
      },
    });
  };

  const onPressShippingAddressTypes = () => {
    const options: Option[] = SHIPPING_ADDRESS_TYPES?.map(it => ({
      key: it.id,
      text: it.text,
    }));
    SelectOptionModule.open({
      title: 'Chọn khu vực',
      options,
      onSelected: function (option: Option) {
        setData({ shippingAddressType: option.key as ShippingAddressType });
      },
    });
  };

  const onPressJournalTypes = () => {
    const options: Option[] = JOURNAL_TYPES?.map(it => ({
      key: it.id,
      text: it.text,
    }));
    SelectOptionModule.open({
      title: 'Chọn phương thức',
      options,
      onSelected: function (option: Option) {
        setData({ journal: option.key as JournalType });
      },
    });
  };

  const onPressDeliveryExpectedDate = () => {
    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Ngày giờ muốn nhận hàng',
        renderContent: () => {
          return (
            <DatePickerSheet
              mode="date"
              minimumDate={new Date()}
              date={data?.expectedDate?.valueOf() || dayjs().valueOf()}
              onSelected={(date: number) => {
                setData({ expectedDate: dayjs(date) });
                Popup.hide();
              }}
            />
          );
        },
      },
    });
  };

  const validate = () => {
    let errors: Record<string, string> = {};
    if (isEmpty(data?.crmGroup)) {
      errors.distributor = 'Vui lòng chọn bên bán';
    }
    if (isEmpty(data?.partner)) {
      errors.partner = 'Vui lòng chọn khách hàng';
    }
    if (isEmpty(data?.deliveryAddress)) {
      errors.deliveryAddress = 'Vui lòng chọn địa chỉ nhận';
    }
    if (isEmpty(data?.priceList)) {
      errors.priceList = 'Vui lòng chọn bảng giá';
    }
    if (isEmpty(data?.warehouse)) {
      errors.warehouse = 'Vui lòng chọn kho xuất hàng';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const submit = () => {
    if (!validate()) return;
    next?.();
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section
          style={styles.section}
          title="Thông tin NPP/ Đại lý"
          bodyComponent={Fragment}>
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Bên bán"
            placeholder="Công ty THD"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled
            onPress={onPressCrmGroups}
            value={data.crmGroup?.[1]}
            error={errors?.crmGroup}
          />
          <Input
            style={styles.input}
            title="Khách hàng"
            placeholder="NPP Anh Sơn"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            onPress={onPressPartners}
            value={data.partner?.name}
            error={errors?.partner}
          />
        </Section>

        <Section
          style={styles.section}
          title="Thông tin giao hàng"
          bodyComponent={Fragment}>
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Người nhận"
            placeholder="Anh Đông"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled={isEmpty(data?.partner)}
            value={data.deliveryAddress?.receiverName}
            onPress={onPressDeliveryAddresses}
            error={errors?.deliveryAddress}
          />
          <Input
            style={styles.input}
            title="Địa chỉ giao hàng"
            placeholder="123 Nguyễn trãi, Thanh xuân, Hà nội"
            editable={false}
            disabled={isEmpty(data.partner)}
            value={data.deliveryAddress?.addressDetail}
          />
          <Input
            style={styles.input}
            title="Ghi chú giao hàng"
            placeholder="Nhập ghi chú"
            value={data.saleNote}
            onChangeText={onChangeSaleNote}
          />
          <Input
            style={styles.input}
            title="Bảng giá"
            placeholder="Bán buôn MT"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            onPress={onPressPriceList}
            value={data.priceList?.[1]}
            error={errors?.priceList}
          />
          <Input
            style={styles.input}
            title="Phương thức thanh toán"
            placeholder="COD"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={JOURNAL_TYPE_MAPPING[data.journal]}
            onPress={onPressJournalTypes}
          />
          <Input
            style={styles.input}
            title="Kho xuất hàng"
            placeholder="Kho Trịnh Văn Bô"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            onPress={onPressWarehouses}
            value={data?.warehouse?.[1]}
            error={errors?.warehouse}
          />
          <Input
            style={styles.input}
            title="Khu vực"
            placeholder="Nội thành"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={SHIPPING_ADDRESS_TYPE_MAPPING[data.shippingAddressType]}
            onPress={onPressShippingAddressTypes}
          />
          <Input
            style={styles.input}
            title="Ngày giờ muốn nhận hàng"
            placeholder="03/03/2023 - 08:15"
            rightButtons={[{ icon: images.common.calendarFilled }]}
            editable={false}
            value={data.expectedDate?.format('DD/MM/YYYY')}
            onPress={onPressDeliveryExpectedDate}
          />
        </Section>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text={'Tiếp theo'} onPress={submit} style={styles.button} />
      </View>
    </View>
  );
};

export default SaleOrderFormStepOne;

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
    // paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    paddingBottom: 0,
  },
  input: {},
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    gap: 16,
  },
  button: {},
});
