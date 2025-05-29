import CommonTagItem from '@app/components/CommonTagItem';
import Input from '@app/components/Input';
import {
  CUSTOMER_CATEGORIES,
  CUSTOMER_CATEGORY_MAPPING,
} from '@app/constants/customer-categories.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useCustomerForm } from '@app/hooks/useCustomerForm';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import {
  useContactLevels,
  useCustomers,
  useDistributionChannels,
} from '@app/queries/customer.query';
import { useRoutersList } from '@app/queries/erp-router.query';
import { useVisitFrequencies } from '@app/queries/visit-frequency.query';
import { ExtendedOption } from '@app/screens/common/MultiSelectScreen';
import RoutePlanStateItem from '@app/screens/route-plans/components/RoutePlanStateItem';
import DatePickerSheet from '@core/components/DatePickerSheet';
import Text from '@core/components/Text';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { find, isEmpty, isNil } from 'lodash';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface Props {}

const ClientFormStepTwo: FC<Props> = ({ ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const data = useCustomerForm(state => state.data);
  const setData = useCustomerForm(state => state.setData);
  const errors = useCustomerForm(state => state.errors);
  const { data: channels } = useDistributionChannels();
  const { data: customers } = useCustomers({
    category: 'distributor',
    crm_lead_crm_group_id: user?.crm_group_id?.id,
    is_super: true,
  });
  const { data: routers } = useRoutersList();
  const { data: contactLevels } = useContactLevels();
  const { data: visitFrequencies } = useVisitFrequencies();

  useEffect(() => {
    if (
      !isNil(contactLevels) &&
      !isEmpty(contactLevels) &&
      !data.contactLevel?.[0]
    ) {
      setData({
        contactLevel: [contactLevels[0].id, contactLevels[0].name],
      });
    }
  }, [contactLevels]);

  useEffect(() => {
    if (
      !isNil(channels) &&
      !isEmpty(channels) &&
      !data.distributionChannel?.[0]
    ) {
      setData({
        distributionChannel: [channels[1].id, channels[1].name],
      });
    }
  }, [channels]);

  useEffect(() => {
    if (
      !isNil(visitFrequencies) &&
      !isEmpty(visitFrequencies) &&
      !data.visitFrequency?.[0]
    ) {
      setData({
        visitFrequency: [visitFrequencies[2].id, visitFrequencies[2].name],
      });
    }
  }, [visitFrequencies]);

  useEffect(() => {
    if (!data.visitFromDate) {
      setData({ visitFromDate: dayjs() });
    }
  }, [])

  const onPressVisitFrequencies = () => {
    if (!visitFrequencies) return;
    const options: Option[] = visitFrequencies?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn tần suất viếng thăm',
      options,
      onSelected: (option: Option, data?: any) => {
        setData({ visitFrequency: [Number(option.key), option.text] });
      },
    });
  };

  const onPressVisitFromDate = () => {
    Popup.show({
      type: POPUP_TYPE.BOTTOM_SHEET,
      props: {
        title: 'Ngày bắt đầu viếng thăm',
        renderContent: () => {
          return (
            <DatePickerSheet
              mode="date"
              minimumDate={new Date()}
              date={data?.visitFromDate?.valueOf() || dayjs().valueOf()}
              onSelected={(date: number) => {
                setData({ visitFromDate: dayjs(date) });
                Popup.hide();
              }}
            />
          );
        },
      },
    });
  };

  const onPressRouters = () => {
    if (!routers) return;

    if (!routers) return;
    const options: ExtendedOption[] = routers?.map(it => ({
      key: it.id,
      text: it.name,
      isSelected: Boolean(data.routes?.find(st => st[0] === it.id)),
    }));
    navigation.navigate(SCREEN.MULTI_SELECT, {
      title: 'Chọn tuyến',
      options,
      onSelected: (opts: Option[]) => {
        setData({ routes: opts.map(o => [Number(o.key), o.text]) });
      },
    });
  };

  const onPressRemoveRouteItem = (index: number) => {
    setData({ routes: data.routes?.filter((_, idx) => idx !== index) });
  };

  const onPressContactLevels = () => {
    if (!contactLevels) return;
    const options = contactLevels?.reduce((prev: Option[], it) => {
      if (it.category && it.category === data.category?.[0])
        prev.push({
          key: it.id,
          text: it.name,
        });
      return prev;
    }, []);
    SelectOptionModule.open({
      title: 'Chọn cấp NPP/ Đại lý',
      options,
      onSelected: function (option: Option, data?: any): void {
        const contactLevel = find(contactLevels, it => it.id === option.key);
        if (!contactLevel) return;
        setData({ contactLevel: [contactLevel.id, contactLevel.name] });
      },
    });
  };

  const onPressCategories = () => {
    const options: Option[] = CUSTOMER_CATEGORIES?.map(it => ({
      key: it.id,
      text: it.text,
    }));
    SelectOptionModule.open({
      title: 'Chọn phân loại',
      options,
      onSelected: function (option: Option, data?: any): void {
        const category = find(CUSTOMER_CATEGORIES, it => it.id === option.key);
        if (!category) return;
        setData({
          category: [category.id, category.text],
          contactLevel: undefined,
        });
      },
    });
  };

  const onPressDistributors = () => {
    if (!customers) return;
    const options: Option[] = customers?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn cửa hàng',
      options,
      onSelected: function (option: Option): void {
        setData({ superior: [Number(option.key), option.text] });
      },
    });
  };

  const onPressChannels = () => {
    if (!channels) return;
    const options: Option[] = channels?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn kênh phân phối',
      options,
      onSelected: function (option: Option, data?: any): void {
        const channel = find(channels, it => it.id === option.key);
        if (!channel) return;
        setData({ distributionChannel: [channel.id, channel.name] });
      },
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Input
          title="Tuyến"
          placeholder="Tuyến Miền Bắc"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          error={errors?.routes}
          onPress={onPressRouters}
          renderContent={
            <View style={styles.optionsContainer}>
              {isEmpty(data?.routes) ? (
                <Text style={styles.placeholderText}>Tuyến Miền Bắc</Text>
              ) : (
                data?.routes?.map((route, index) => {
                  return (
                    <CommonTagItem
                      key={route[0]}
                      index={index}
                      data={route}
                      onRemove={onPressRemoveRouteItem}
                    />
                  );
                })
              )}
            </View>
          }
        />
        <Input
          title="Phân loại"
          placeholder="Đại lý"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={
            data?.category?.[0]
              ? CUSTOMER_CATEGORY_MAPPING[data.category[0]]?.displayText
              : ''
          }
          onPress={onPressCategories}
          error={errors?.category}
          disabled={!isNil(data?.id)}
        />
        <Input
          title="Cấp NPP/ Đại lý"
          placeholder="Nhà phân phối cấp 1"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.contactLevel?.[1]}
          onPress={onPressContactLevels}
          error={errors?.contactLevel}
        />
        <Input
          title="Nhà phân phối/ đại lý cấp trên"
          placeholder="NPP Anh Sơn"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.superior?.[1]}
          onPress={onPressDistributors}
          error={errors?.superior}
        />
        <Input
          title="Kênh phân phối"
          placeholder="GT"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.distributionChannel?.[1]}
          error={errors?.distributionChannel}
          onPress={onPressChannels}
        />
        <Input
          title="Tần suất viếng thăm"
          placeholder="F4"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.visitFrequency?.[1]}
          error={errors?.visitFrequency}
          onPress={onPressVisitFrequencies}
        />
        <Input
          title="Ngày bắt đầu viếng thăm"
          placeholder="15/06/2024"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.calendarFilled }]}
          value={data.visitFromDate?.format('DD/MM/YYYY')}
          onPress={onPressVisitFromDate}
          error={errors?.visitFromDate}
        />
        <Input
          title="Nhân viên phụ trách"
          placeholder="Nhân viên kinh doanh"
          value={data?.userId?.[1]}
          disabled
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
        />
        <Input
          title="Đội ngũ bán hàng"
          placeholder="Đội ngũ kinh doanh"
          value={data?.teamId?.[1]}
          disabled
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
        />
        <Input
          title="Công ty con"
          placeholder="Công ty con"
          value={data?.groupId?.[1]}
          disabled
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
        />
        {/* <Input
          title="Hạn mức công nợ"
          placeholder="Hạn mức công nợ"
          disabled
          style={styles.input}
          numberOfLines={1}
          value={data?.debtLimit ? PriceUtils.format(data.debtLimit) : ''}
        /> */}
        {/* <Input
          title="Số ngày nợ tối đa"
          placeholder="Số ngày nợ tối đa"
          disabled
          style={styles.input}
          numberOfLines={1}
          value={data?.numberOfDaysDebt ? String(data.numberOfDaysDebt) : ''}
        /> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ClientFormStepTwo;

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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    marginTop: 11,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color22222280,
    lineHeight: 20,
    marginTop: 6,
  },
});
