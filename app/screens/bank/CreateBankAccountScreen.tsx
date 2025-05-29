import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useBankAccountForm } from '@app/hooks/useBankAccountForm';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { updateCustomerMutation } from '@app/queries/customer.mutation';
import { useDmsBanks } from '@app/queries/dms-bank.query';
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
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_BANK_ACCOUNT
>;

const CreateBankAccountScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const { data: banks, isRefetching, isLoading } = useDmsBanks();
  const data = useBankAccountForm(state => state.data);
  const setData = useBankAccountForm(state => state.setData);
  const errors = useBankAccountForm(state => state.errors);
  const setErrors = useBankAccountForm(state => state.setErrors);
  const resetForm = useBankAccountForm(state => state.reset);

  const mutation = updateCustomerMutation();

  // effects
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  useEffect(() => {
    if (mutation.isPending || isLoading || isRefetching) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending, isLoading, isRefetching]);

  const onPressBanks = () => {
    if (!banks) return;
    const options: Option[] = banks.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn ngân hàng',
      options,
      onSelected: function (option: Option, data?: any): void {
        setData?.({
          bank: [Number(option.key), option.text],
        });
      },
    });
  };

  const validate = () => {
    let errors: Record<string, string> = {};
    if (isEmpty(data?.bank)) {
      errors.bank = 'Vui lòng chọn ngân hàng';
    }
    if (isEmpty(data?.bank_branch)) {
      errors.branch = 'Vui lòng điền chi nhánh ngân hàng';
    }
    if (isEmpty(data?.account_owner)) {
      errors.account_owner = 'Vui lòng điền thông tin chủ tài khoản';
    }
    if (isEmpty(data?.account_number)) {
      errors.account_number = 'Vui lòng điền số tài khoản';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const submit = () => {
    if (!validate() || !user) return;

    mutation
      .mutateAsync({
        id: route.params.customerId,
        data: {
          partner_account_bank_ids: {
            create: [
              {
                bank_id: data.bank?.[0],
                bank_branch: data.bank_branch?.toUpperCase(),
                account_owner: data.account_owner?.toUpperCase(),
                account_number: data.account_number?.toUpperCase(),
              },
            ],
          },
          update_uid: user?.id,
        },
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['customer-detail'],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Tài khoản ngân hàng"
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
        <Input
          title="Ngân hàng"
          placeholder="Ngân hàng VPBank"
          rightButtons={[{ icon: images.common.chevronForward }]}
          editable={false}
          value={data.bank?.[1]}
          onPress={onPressBanks}
          error={errors?.bank}
        />
        <Input
          title="Chi nhánh ngân hàng"
          placeholder="Chi nhánh Hoàn Kiếm"
          value={data.bank_branch}
          onChangeText={text => setData?.({ bank_branch: text })}
          error={errors?.branch}
        />
        <Input
          title="Chủ tài khoản"
          placeholder="Nguyễn Văn A"
          value={data.account_owner}
          onChangeText={text => setData?.({ account_owner: text })}
          error={errors?.account_owner}
        />
        <Input
          title="Số tài khoản"
          placeholder="12121212"
          value={data.account_number}
          onChangeText={text => setData?.({ account_number: text })}
          error={errors?.account_number}
        />
      </KeyboardAwareScrollView>
      <SafeAreaView edges={['bottom']}>
        <HStack style={styles.footer}>
          <Button
            text="Xác nhận"
            style={styles.btn}
            onPress={submit}
            loading={mutation.isPending}
          />
        </HStack>
      </SafeAreaView>
    </View>
  );
};

export default CreateBankAccountScreen;

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
    paddingVertical: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  btn: {
    flex: 1,
  },
});
