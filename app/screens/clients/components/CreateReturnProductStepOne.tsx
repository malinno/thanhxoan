import Input from '@app/components/Input';
import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import { TDeliveryAddress } from '@app/hooks/usePosOrderForm';
import { useReturnProductForm } from '@app/hooks/useReturnProductForm';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpWarehouse } from '@app/interfaces/entities/erp-warehouse.entity';
import { useCrmGroups } from '@app/queries/crm-group.query';
import { useCustomerDetail } from '@app/queries/customer.query';
import { useProductPriceList } from '@app/queries/product.query';
import { useReasonReturnList } from '@app/queries/return-product.query';
import { useWarehouses } from '@app/queries/warehouse.query';
import Button from '@core/components/Button';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface Props {
  next?: () => void;
  previous?: () => void;
  partnerId?: number;
}

const CreateReturnProductStepOne: FC<Props> = ({
  next,
  previous,
  ...props
}) => {
  const navigation = useNavigation();

  const data = useReturnProductForm(state => state.data);
  const setData = useReturnProductForm(state => state.setData);
  const errors = useReturnProductForm(state => state.errors);
  const setErrors = useReturnProductForm(state => state.setErrors);
  const { data: priceList } = useProductPriceList({});
  const { data: crmGroups } = useCrmGroups();
  const { data: stockWarehouses } = useWarehouses();
  const { data: partnerDetail } = useCustomerDetail(props?.partnerId);

  const [warehouses, setWarehouses] = useState<ErpWarehouse[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    TDeliveryAddress[]
  >([]);
  const { data: reasonReturns } = useReasonReturnList();

  useEffect(() => {
    const wh = stockWarehouses ? stockWarehouses : [];
    setWarehouses(wh);

    if (wh?.[0] && !data.warehouse_id) setData({ warehouse_id: wh[0] });
  }, [stockWarehouses]);

  useEffect(() => {
    // const addresses: TDeliveryAddress[] = [];
    // if (data.partner) {
    //   addresses.push({
    //     id: data.partner.id,
    //     receiverName: data.partner.name,
    //     phone: data.partner.phone,
    //     addressDetail: data.partner.street2,
    //   });
    // }
    // if (partnerContacts) {
    //   for (const item of partnerContacts) {
    //     addresses.push({
    //       id: item.id,
    //       receiverName: item.name,
    //       phone: item.phone,
    //       addressDetail: [
    //         item.street2,
    //         item.address_town_id[1],
    //         item.address_district_id[1],
    //         item.address_state_id[1],
    //       ]
    //         .filter(identity)
    //         .join(', '),
    //     });
    //   }
    // }
    // setDeliveryAddresses(addresses);
  }, [data.partner_id]);

  const onChangeDescription = (description: string) => setData({ description });

  const onPressPartners = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      filter: {
        category: 'distributor',
      },
      title: 'Chọn khách hàng',
      selectedIds: data.partner_id ? [data.partner_id.id] : undefined,
      onSelected: (customers: ErpCustomer[]) => {
        const customer = customers[0];
        if (customer.id === data.partner_id?.id) return;
        setData({
          partner_id: customer,
        });
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
      title: 'Chọn kho',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({
          warehouse_id: { id: Number(option.key), name: option.text },
        });
      },
    });
  };
  const onPressReasonReturn = () => {
    if (!reasonReturns) return;
    const options: Option[] = reasonReturns?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn lý do',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({
          reason_return_id: { id: Number(option.key), name: option.text },
        });
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
        setData({
          pricelist_id: { id: Number(option.key), name: option.text },
        });
      },
    });
  };

  const validate = () => {
    let errors: Record<string, string> = {};
    if (isEmpty(data?.partner_id)) {
      errors.partner_id = 'Vui lòng chọn khách hàng';
    }
    if (isEmpty(data?.pricelist_id)) {
      errors.pricelist_id = 'Vui lòng chọn bảng giá';
    }
    if (isEmpty(data?.warehouse_id)) {
      errors.warehouse_id = 'Vui lòng chọn kho';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const submit = () => {
    if (!validate()) return;
    next?.();
  };

  const onPressCustomers = () => {
    navigation.navigate(SCREEN.CUSTOMERS_PICKER, {
      title: 'Chọn khách hàng',
      filter: { category: 'agency' },
      selectedIds: data.partner_id ? [data.partner_id.id] : undefined,
      onSelected: (customers: ErpCustomer[]) => {
        const customer = customers[0];
        if (customer.id === data.partner_id?.id) return;
        setData({
          partner_id: customer,
        });
      },
    });
  };
  console.log(`errors`, errors);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section
          style={styles.section}
          title="Thông tin khách hàng"
          bodyComponent={Fragment}>
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Khách hàng"
            placeholder="Chọn khách hàng"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={data?.partner_id?.name}
            onPress={onPressCustomers}
            error={errors?.partner_id}
          />
          <Input
            style={styles.input}
            title="Lý do "
            placeholder="Chọn lý do"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            value={data?.reason_return_id?.name}
            onPress={onPressReasonReturn}
            error={errors?.reason_return_id}
          />
          <Input
            style={styles.input}
            title="Mô tả chi tiết"
            placeholder="Nhập mô tả chi tiết"
            value={data.description}
            onChangeText={onChangeDescription}
          />
        </Section>
        <Section
          style={styles.section}
          title="Thông tin bên nhận đổi trả"
          bodyComponent={Fragment}>
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Bên bán"
            placeholder="Công ty THD"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            disabled
            value={partnerDetail?.crm_lead_crm_group_id?.[1]}
            error={errors?.crmGroup}
          />
          <Input
            style={styles.input}
            title="Bảng giá"
            placeholder="Bán buôn MT"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            onPress={onPressPriceList}
            value={data?.pricelist_id?.name}
            error={errors?.pricelist_id}
          />
          <Input
            style={styles.input}
            title="Kho"
            placeholder="Kho Trịnh Văn Bô"
            rightButtons={[{ icon: images.common.chevronForward }]}
            editable={false}
            onPress={onPressWarehouses}
            value={data?.warehouse_id?.name}
            error={errors?.warehouse_id}
          />
        </Section>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text={'Tiếp theo'} onPress={submit} style={styles.button} />
      </View>
    </View>
  );
};

export default CreateReturnProductStepOne;

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
