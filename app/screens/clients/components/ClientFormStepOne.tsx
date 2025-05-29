import Input from '@app/components/Input';
import PhotoInput from '@app/components/PhotoInput';
import RadioButtonGroup, {
  IRadioButton,
} from '@app/components/RadioButtonGroup';
import { COMPANY_TYPES } from '@app/constants/company-types.constant';
import { CompanyType } from '@app/enums/company-type.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useCustomerForm } from '@app/hooks/useCustomerForm';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import {
  useBusinessDistricts,
  useBusinessStates,
  useCustomerProductCategories,
  useCustomerSources,
  useTowns,
} from '@app/queries/customer.query';
import { TLocation } from '@app/screens/address/MapScreen';
import Text from '@core/components/Text';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { find, isEmpty, isNil } from 'lodash';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import ClientLocate from './ClientLocate';
import ClientTagItem from './ClientTagItem';

interface Props {}

const ClientFormStepOne: FC<Props> = ({ ...props }) => {
  const navigation = useNavigation();

  const data = useCustomerForm(state => state.data);
  const setData = useCustomerForm(state => state.setData);
  const errors = useCustomerForm(state => state.errors);

  const { data: sources } = useCustomerSources();
  const { data: productCategories } = useCustomerProductCategories();
  const { data: states } = useBusinessStates();
  const { data: districts } = useBusinessDistricts(
    {
      state_id: data.state?.[0],
    },
    !isNil(data.state?.[0]),
  );
  const { data: towns } = useTowns(
    {
      district_id: data.district?.[0],
      state_id: data.state?.[0],
    },
    !isNil(data.district?.[0]),
  );

  useEffect(() => {
    if (data?.type !== CompanyType.company) onChangeTaxCode('');
  }, [data?.type]);

  const onPressLocate = () => {
    navigation.navigate(SCREEN.MAP, {
      screenTitle: 'Vị trí khách hàng',
      confirmText: 'Xác nhận vị trí',
      location: data.coords
        ? {
            address: data.address,
            latitude: data.coords.lat,
            longitude: data.coords.lng,
          }
        : undefined,
      onLocation: (location: TLocation) => {
        setData({
          // address: location.address,
          coords: {
            lat: location.latitude,
            lng: location.longitude,
          },
        });
      },
      readOnlyMode: !isNil(data?.id),
    });
  };

  const onPressTags = () => {
    navigation.navigate(SCREEN.TAGS, {
      onSelected: (items: ErpTag[]) => setData({ tags: items }),
      selectedIds: !!data.tags ? data.tags?.map(it => it.id) : [],
    });
  };

  const onPressRemoveTagItem = (index: number) => {
    setData({ tags: data.tags?.filter((_, idx) => idx !== index) });
  };

  const onPressSources = () => {
    if (!sources) return;
    const options: Option[] = sources?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn nguồn khách hàng',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        const source = find(sources, it => it.id === option.key);
        if (!source) return;
        setData({ source: [source.id, source.name] });
      },
    });
  };

  const onPressProductCategories = () => {
    if (!productCategories) return;
    const options: Option[] = productCategories?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn nhãn',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        const productCategory = find(
          productCategories,
          it => it.id === option.key,
        );
        if (!productCategory) return;
        setData({
          productCategory: [productCategory.id, productCategory.name],
        });
      },
    });
  };

  const onPressStates = () => {
    if (!states) return;
    const options: Option[] = states?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn tỉnh/ thành phố',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({
          state: [Number(option.key), option.text],
          district: undefined,
          town: undefined,
        });
      },
    });
  };

  const onPressDistricts = () => {
    if (!districts) return;
    const options: Option[] = districts
      .filter(d => {
        return d.state_id && data.state && d.state_id[0] === data.state?.[0];
      })
      ?.map(it => ({
        key: it.id,
        text: it.name,
      }));
    SelectOptionModule.open({
      title: 'Chọn quận/ huyện',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({
          district: [Number(option.key), option.text],
          town: undefined,
        });
      },
    });
  };

  const onPressTowns = () => {
    if (!towns) return;
    const options: Option[] = towns
      ?.filter(t => {
        return (
          t.state_id &&
          t.district_id &&
          data.state &&
          data.district &&
          t.state_id[0] === data.state?.[0] &&
          t.district_id[0] === data?.district[0]
        );
      })
      ?.map(it => ({
        key: it.id,
        text: it.name,
      }));
    SelectOptionModule.open({
      title: 'Chọn phường/ xã',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, data?: any): void {
        setData({ town: [Number(option.key), option.text] });
      },
    });
  };

  const onChangeType = (type: IRadioButton) =>
    setData({ type: type.id as CompanyType });
  const onChangeName = (name: string) => setData({ name });
  const onChangeRepresentative = (representative: string) =>
    setData({ representative });
  const onChangePhone = (phone: string) => setData({ phone });
  const onChangeTaxCode = (taxCode: string) => setData({ taxCode });
  const onChangeAddress = (address: string) => setData({ address });
  const onChangeEmail = (email: string) => setData({ email });
  const onChangeImage = (images: string[]) => setData({ image: images[0] });

  const isCurrentPositionLocated = Boolean(data.coords?.lat);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <RadioButtonGroup
          style={{ marginTop: 16 }}
          value={data?.type || 'person'}
          horizontal
          data={COMPANY_TYPES}
          onChange={onChangeType}
        />

        <Input
          title="Tên khách hàng"
          placeholder="Nhập tên khách hàng"
          style={styles.input}
          numberOfLines={1}
          value={data.name}
          onChangeText={onChangeName}
          error={errors?.name}
        />
        <Input
          title="Người đại diện"
          placeholder="Nhập người đại diện"
          style={styles.input}
          numberOfLines={1}
          value={data.representative}
          onChangeText={onChangeRepresentative}
          error={errors?.representative}
        />
        <Input
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          style={styles.input}
          numberOfLines={1}
          value={data.phone}
          onChangeText={onChangePhone}
          error={errors?.phone}
          keyboardType="number-pad"
        />
        {data?.type === CompanyType.company && (
          <Input
            title="Mã số thuế"
            placeholder="02366366666"
            style={styles.input}
            numberOfLines={1}
            value={data.taxCode}
            onChangeText={onChangeTaxCode}
            error={errors?.taxCode}
          />
        )}
        <ClientLocate
          style={styles.input}
          verified={isCurrentPositionLocated}
          isFetching={data.isFetchingGeolocation}
          onPress={onPressLocate}
          // disabled={!isNil(data?.id)}
        />

        <Input
          title="Địa chỉ"
          placeholder="Chọn địa chỉ"
          style={styles.input}
          numberOfLines={1}
          value={data.address}
          onChangeText={onChangeAddress}
          // editable={false}
          error={errors?.address}
        />
        <Input
          title="Tỉnh/ thành phố"
          placeholder="Chọn tỉnh/ thành phố"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.state?.[1]}
          onPress={onPressStates}
          error={errors?.state}
        />
        <Input
          title="Quận/ huyện"
          placeholder="Chọn quận/ huyện"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.district?.[1]}
          onPress={onPressDistricts}
          disabled={!data?.state?.[0]}
          error={errors?.district}
        />
        <Input
          title="Phường/ xã"
          placeholder="Chọn phường/ xã"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.town?.[1]}
          onPress={onPressTowns}
          disabled={!data?.district?.[0]}
          error={errors?.town}
        />
        <Input
          title="Tag"
          editable={false}
          rightButtons={[{ icon: images.common.chevronForward }]}
          onPress={onPressTags}
          error={errors?.tags}
          renderContent={
            <View style={styles.tags}>
              {isEmpty(data?.tags) ? (
                <Text style={styles.placeholderText}>Chọn từ khóa</Text>
              ) : (
                data?.tags?.map((tag, index) => {
                  return (
                    <ClientTagItem
                      key={tag.id}
                      index={index}
                      data={tag}
                      onRemove={onPressRemoveTagItem}
                    />
                  );
                })
              )}
            </View>
          }
        />
        {/* <Input
          title="Nguồn khách hàng"
          placeholder="Chọn nguồn khách hàng"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data.source?.[1]}
          onPress={onPressSources}
          error={errors?.source}
        /> */}
        {/* <Input
          title="Nhãn sản phẩm"
          placeholder="Chọn nhãn sản phẩm"
          editable={false}
          style={styles.input}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data.productCategory?.[1]}
          onPress={onPressProductCategories}
          error={errors?.productCategory}
        /> */}
        <Input
          title="Email"
          placeholder="suamegold@mail.com"
          style={styles.input}
          numberOfLines={1}
          value={data.email}
          onChangeText={onChangeEmail}
          error={errors?.email}
        />
        <PhotoInput
          style={{
            borderWidth: 0,
            paddingHorizontal: 0,
          }}
          values={data.image ? [data.image] : []}
          onChange={onChangeImage}
          error={errors?.image}
          multiple={false}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ClientFormStepOne;

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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color00000033,
    lineHeight: 20,
    marginTop: 6,
  },
});
