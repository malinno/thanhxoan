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
import { TDeliveryAddress, usePosOrderForm } from '@app/hooks/usePosOrderForm';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { useCustomerContacts } from '@app/queries/customer.query';
import { useProductPriceList } from '@app/queries/product.query';
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
import { identity, isEmpty, isNil } from 'lodash';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface Props {
  partnerId?: number;
  next?: () => void;
  previous?: () => void;
}

const PosOrderFormStepOne: FC<Props> = ({
  next,
  previous,
  partnerId,
  ...props
}) => {
  const navigation = useNavigation();

  const data = usePosOrderForm(state => state.data);
  const setData = usePosOrderForm(state => state.setData);
  const errors = usePosOrderForm(state => state.errors);
  const setErrors = usePosOrderForm(state => state.setErrors);

  const { data: priceList, isFetching: isFetchingPriceList } =
    useProductPriceList({
      // partner_id: data.partner?.id,
    });
  const { data: partnerContacts, isFetching: isFetchingPartnerContacts } =
    useCustomerContacts(data.partner?.id);

  const [deliveryAddresses, setDeliveryAddresses] = useState<
    TDeliveryAddress[]
  >([]);

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

  const onPressDistributors = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      title: 'Chọn nhà phân phối',
      filter: { category: 'distributor' },
      selectedIds: data.distributor?.[0] ? [data.distributor?.[0]] : undefined,
      onSelected: (distributors: ErpCustomer[]) => {
        const distributor = distributors[0];
        if (distributor.id === data.distributor?.[0]) return;
        setData({ distributor: [Number(distributor.id), distributor.name] });
      },
    });
  };

  const onPressCustomers = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      title: 'Chọn đại lý',
      filter: { category: 'agency' },
      selectedIds: data.partner?.id ? [data.partner?.id] : undefined,
      onSelected: (customers: ErpCustomer[]) => {
        const customer = customers[0];
        if (customer.id === data.partner?.id) return;
        setData({
          partner: customer,
          distributor: customer?.superior_id,
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
      onSelected: function (option: Option) {
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
        title: 'Ngày giao dự kiến',
        renderContent: () => {
          return (
            <DatePickerSheet
              mode="date"
              minimumDate={new Date()}
              date={data?.deliveryExpectedDate?.valueOf() || dayjs().valueOf()}
              onSelected={(date: number) => {
                setData({ deliveryExpectedDate: dayjs(date) });
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
    if (isEmpty(data?.distributor)) {
      errors.distributor = 'Chưa có thông tin NPP';
    }
    if (isEmpty(data?.partner)) {
      errors.partner = 'Vui lòng chọn khách hàng';
    }
    if (isEmpty(data?.deliveryAddress)) {
      errors.deliveryAddress = 'Vui lòng chọn địa chỉ nhận';
    }
    if (isEmpty(data?.priceList)) {
      errors.priceList = 'Bạn chưa chọn bảng giá';
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
            title="Khách hàng"
            placeholder="Chọn đại lý"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={data.partner?.name}
            onPress={onPressCustomers}
            error={errors?.partner}
            disabled={!isNil(partnerId)}
          />
          <Input
            style={styles.input}
            title="Bên bán"
            placeholder="Chọn Nhà phân phối"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={data.distributor?.[1]}
            // onPress={onPressDistributors}
            error={errors?.distributor}
          />
        </Section>

        <Section
          style={styles.section}
          title="Thông tin giao hàng"
          bodyComponent={Fragment}
          // rightComponent={
          //   <HStack
          //     // onPress={onPressCreateNote}
          //     style={styles.editBtn}>
          //     <Text style={styles.editText}>Thay đổi</Text>
          //     <Image
          //       source={images.client.edit}
          //       tintColor={colors.primary}
          //       style={{ width: 16, height: 16 }}
          //     />
          //   </HStack>
          // }
        >
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Tên người nhận"
            placeholder="Chị Hà kho"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled={isEmpty(data.partner)}
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
            disabled={isEmpty(data.partner)}
            value={data.saleNote}
            onChangeText={onChangeSaleNote}
          />
          <Input
            style={styles.input}
            title="Bảng giá"
            placeholder="Bán buôn MT"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled={isEmpty(data.partner)}
            value={data.priceList?.[1]}
            onPress={onPressPriceList}
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
            title="Khu vực"
            placeholder="Nội thành"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={SHIPPING_ADDRESS_TYPE_MAPPING[data.shippingAddressType]}
            onPress={onPressShippingAddressTypes}
          />
          <Input
            style={styles.input}
            title="Ngày giao dự kiến"
            placeholder="25/05/2024"
            rightButtons={[{ icon: images.common.calendarFilled }]}
            editable={false}
            value={data.deliveryExpectedDate?.format('DD/MM/YYYY')}
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

export default PosOrderFormStepOne;

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
  section: {
    paddingBottom: 0,
  },
  input: {},
  editBtn: {},
  editText: {
    fontSize: 12,
    fontWeight: '300',
    marginRight: 4,
    color: colors.color2651E5,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    gap: 16,
  },
  button: {},
});
