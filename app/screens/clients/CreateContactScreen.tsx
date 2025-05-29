import Input from '@app/components/Input';
import RadioButtonGroup, {
  IRadioButton,
} from '@app/components/RadioButtonGroup';
import { CONTACT_TYPES } from '@app/constants/contact-types.constant';
import { ContactType } from '@app/enums/contact-type.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { updateCustomerMutation } from '@app/queries/customer.mutation';
import {
  useBusinessStates,
  useBusinessDistricts,
  useTowns,
} from '@app/queries/customer.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import { find } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type CreateContactDataViewModel = {
  name?: string;
  function?: string;
  type?: ContactType;
  phone?: string;
  email?: string;
  note?: string;
  street2?: string;
  state?: [number, string];
  district?: [number, string];
  town?: [number, string];
};

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CREATE_CONTACT>;

const CreateContactScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  // queries
  const { data: states } = useBusinessStates();
  const { data: districts } = useBusinessDistricts();
  const { data: towns } = useTowns();
  const mutation = updateCustomerMutation();

  // states
  const [data, setData] = useState<CreateContactDataViewModel>({
    type: CONTACT_TYPES[0].id,
  });

  // effects
  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [mutation.isPending]);

  const onChangeName = (name: string) =>
    setData(preState => ({ ...preState, name }));

  const onChangeFunc = (func: string) =>
    setData(preState => ({ ...preState, function: func }));

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
        const state = find(states, it => it.id === option.key);
        if (!state) return;
        setData(preState => ({
          ...preState,
          state: [state.id, state.name],
          district: undefined,
          town: undefined,
        }));
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
        const district = find(districts, it => it.id === option.key);
        if (!district) return;
        setData(preState => ({
          ...preState,
          district: [district.id, district.name],
          town: undefined,
        }));
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
        const town = find(towns, it => it.id === option.key);
        if (!town) return;
        setData(preState => ({ ...preState, town: [town.id, town.name] }));
      },
    });
  };

  const onChangePhone = (phone: string) =>
    setData(preState => ({ ...preState, phone }));

  const onChangeEmail = (email: string) =>
    setData(preState => ({ ...preState, email }));

  const onChangeNote = (note: string) =>
    setData(preState => ({ ...preState, note }));

  const onChangeAddress = (street2: string) =>
    setData(preState => ({ ...preState, street2 }));

  const onChangeType = (type: IRadioButton) =>
    setData(preState => ({ ...preState, type: type.id as ContactType }));

  const validate = (): boolean => {
    return true;
  };

  const submit = async () => {
    if (!validate() || !user?.id) return false;
    mutation
      .mutateAsync({
        id: route.params.customerId,
        data: {
          update_uid: user?.id,
          child_ids: {
            create: [
              {
                name: String(data.name),
                phone: String(data.phone),
                email: String(data.email),
                comment: String(data.note),
                type: data.type,
                street2: String(data.street2),
                address_state_id: data.state?.[0],
                address_district_id: data.district?.[0],
                address_town_id: data.town?.[0],
                function: data.function,
              },
            ],
          },
        },
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['customer-contacts'],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Thông tin liên hệ" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <RadioButtonGroup
          style={{ marginTop: 16 }}
          value={data.type || CONTACT_TYPES[0].id}
          data={CONTACT_TYPES}
          onChange={onChangeType}
        />
        <Input
          title="Tên liên hệ"
          placeholder="Nguyễn Văn A"
          style={styles.input}
          value={data?.name}
          onChangeText={onChangeName}
        />
        <Input
          title="Chức vụ"
          placeholder="Chủ cửa hàng"
          style={styles.input}
          value={data?.function}
          onChangeText={onChangeFunc}
        />
        <Input
          title="Số điện thoại"
          placeholder="0988888888"
          style={styles.input}
          value={data?.phone}
          onChangeText={onChangePhone}
        />
        <Input
          title="Địa chỉ"
          placeholder="Số 1, Phố Thái Hà"
          value={data?.street2}
          style={styles.input}
          onChangeText={onChangeAddress}
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
        />
        <Input
          title="Email"
          placeholder="suamegold@gmail.com"
          style={styles.input}
          value={data.email}
          onChangeText={onChangeEmail}
        />
        <Input
          title="Ghi chú"
          placeholder="suamegold.vn"
          style={styles.input}
          value={data.note}
          onChangeText={onChangeNote}
        />
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text="Lưu" onPress={submit} />
      </View>
    </View>
  );
};

export default CreateContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
