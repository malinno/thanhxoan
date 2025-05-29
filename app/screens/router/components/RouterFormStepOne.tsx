import Input from '@app/components/Input';
import RadioButtonGroup, {
  IRadioButton,
} from '@app/components/RadioButtonGroup';
import Section from '@app/components/Section';
import { DAYS_OF_WEEK } from '@app/constants/app.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { useRouterForm } from '@app/hooks/useRouterForm';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface Props {}

const RouterFormStepOne: FC<Props> = ({ ...props }) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions()

  const data = useRouterForm(state => state.data);
  const setData = useRouterForm(state => state.setData);
  const errors = useRouterForm(state => state.errors);

  const onPressUsers = () => {
    navigation.navigate(SCREEN.USERS_PICKER, {
      title: 'Chọn nhân viên',
      selectedIds: data.salesperson_id ? [data.salesperson_id[0]] : undefined,
      onSelected: (users: ErpUser[]) => {
        const user = users[0];
        if (user.id === data.salesperson_id?.[0]) return;
        setData({
          salesperson_id: [user.id, String(user.short_name)],
          team_id: user.sale_team_id ? [user.sale_team_id.id, user.sale_team_id.name]: undefined,
          cmp_id: user.company,
        });
      },
    });
  };

  const onChangeName = (name: string) => {
    setData({ name });
  };

  const onChangeDayOfWeek = ({ id }: IRadioButton) =>
    setData({ day_of_week: Number(id) });

  return (
    <View style={styles.container}>
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
              width: (width - 32) / DAYS_OF_WEEK.length,
            }}
            itemGap={0}
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
    </View>
  );
};

export default RouterFormStepOne;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {},
  section: {
    backgroundColor: undefined,
  },
  input: {},
});
