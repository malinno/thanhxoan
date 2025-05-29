import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import RadioButtonGroup, {
  IRadioButton,
} from '@app/components/RadioButtonGroup';
import Section from '@app/components/Section';
import { DAYS_OF_WEEK } from '@app/constants/app.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { createRouterMutation } from '@app/queries/router.mutation';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import { ValidationError } from '@core/interfaces/ValidationError';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isEmpty, omit } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CREATE_ROUTER>;

export type RouterViewModel = {
  name?: string;
  salesperson_id?: [number, string];
  team_id?: [number, string];
  cmp_id?: [number, string];
  store_ids?: [number, string][];
  day_of_week: number;
};

const CreateRouterFormScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const createMutation = createRouterMutation();

  const [data, setData] = useState<RouterViewModel>({
    day_of_week: DAYS_OF_WEEK[0].id,
  });
  const [errors, setErrors] = useState<ValidationError>();

  useEffect(() => {
    if (createMutation.isPending) {
      Spinner.show();
    } else Spinner.hide();
    return () => Spinner.hide();
  }, [createMutation.isPending]);

  useEffect(() => {
    if (createMutation.isSuccess && createMutation.data?.response) {
      const response = createMutation.data.response;
      const result = response?.result?.routers?.[0];
      navigation.dispatch(
        StackActions.replace(SCREEN.ROUTER_DETAIL, {
          id: result.id,
        }),
      );
    }
  }, [createMutation.isSuccess, createMutation.data]);

  useEffect(() => {
    setErrors(preState => ({ ...omit(preState, ['name']) }));
  }, [data.name]);

  const onPressUsers = () => {
    navigation.navigate(SCREEN.USERS_PICKER, {
      title: 'Chọn nhân viên',
      selectedIds: data.salesperson_id ? [data.salesperson_id[0]] : undefined,
      onSelected: (users: ErpUser[]) => {
        const user = users[0];
        if (user.id === data.salesperson_id?.[0]) return;
        updateData({
          salesperson_id: [user.id, String(user.short_name)],
          team_id: user.sale_team_id ? [user.sale_team_id.id, user.sale_team_id.name]: undefined,
          cmp_id: user.company,
        });
      },
    });
  };

  const onChangeName = (name: string) => {
    updateData({ name });
  };

  const onChangeDayOfWeek = ({ id }: IRadioButton) =>
    setData(preState => ({ ...preState, day_of_week: Number(id) }));

  const updateData = (newData: Partial<RouterViewModel>) => {
    setData(preState => ({ ...preState, ...newData }));
  };

  const validate = (): boolean => {
    let errors: Record<string, string> = {};
    if (isEmpty(data.name)) {
      errors.name = 'Tên tuyến không được để trống';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const save = () => {
    if (!validate() || !user?.id || createMutation.isPending) return false;

    createMutation.mutate({
      create_uid: user.id,
      name: data.name,
      day_of_week: data.day_of_week ? String(data.day_of_week) : undefined,
      salesperson_id: data.salesperson_id?.[0]!,
      team_id: data.team_id?.[0]!,
    });
  };

  return (
    <View style={styles.container}>
      <Header title={'Tạo tuyến bán hàng'} />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section
          title="Thông tin tuyến bán hàng"
          bodyComponent={React.Fragment}
          style={styles.section}>
          <Input
            title="Tên tuyến bán hàng"
            placeholder="Tuyến Hà Đông - Nam Từ Liêm"
            style={[styles.input, { marginTop: 0 }]}
            onChangeText={onChangeName}
            value={data.name}
            error={errors?.name}
          />

          <RadioButtonGroup
            horizontal
            style={{ marginTop: 16 }}
            value={data.day_of_week}
            data={DAYS_OF_WEEK}
            itemOuterStyle={{
              flexDirection: 'column',
              width: (dimensions.width - 32) / DAYS_OF_WEEK.length,
            }}
            onChange={onChangeDayOfWeek}
          />

          <Input
            title="Nhân viên phụ trách"
            placeholder="Nguyễn Anh Sơn"
            style={[styles.input]}
            editable={false}
            rightButtons={[{ icon: images.common.chevronForward }]}
            onPress={onPressUsers}
            value={data.salesperson_id?.[1]}
            error={errors?.salesperson}
          />
          <Input
            title="Đội ngũ bán hàng"
            placeholder="Team Sale 1"
            style={[styles.input]}
            editable={false}
            disabled
            value={data.team_id?.[1]}
            error={errors?.team}
          />
          <Input
            title="Công ty con"
            placeholder="B2B"
            style={[styles.input]}
            editable={false}
            disabled
            value={data.cmp_id?.[1]}
            error={errors?.cmp}
          />
        </Section>
      </KeyboardAwareScrollView>
      <HStack style={styles.footer}>
        <Button
          text="Lưu"
          colors={colors.primary}
          style={[styles.btn]}
          onPress={save}
          loading={createMutation.isPending}
        />
      </HStack>
    </View>
  );
};

export default CreateRouterFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {},
  section: {
    backgroundColor: undefined,
  },
  input: {},
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  btn: {
    flex: 1,
  },
});
