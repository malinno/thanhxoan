import Input from '@app/components/Input';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button from '@core/components/Button';
import Checkbox from '@core/components/Checkbox';
import Header from '@core/components/Header';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { find } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CLIENTS_FILTER>;

type ClientsFilterViewModel = {
  confirmed_info: Option;
};

const CLIENT_CONFIRMED_INFO_OPTIONS: Option[] = [
  { key: 'all', text: 'Tất cả' },
  { key: 'true', text: 'Đã xác thực thông tin' },
  { key: 'false', text: 'Chưa xác thực thông tin' },
];

const CLIENT_CONFIRMED_INFO_KEY_MAPPING: Record<string, boolean | undefined> = {
  all: undefined,
  true: true,
  false: false,
};

const ClientsFilterScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const [filter, setFilter] = useState<ClientsFilterViewModel>({
    confirmed_info: CLIENT_CONFIRMED_INFO_OPTIONS[0],
  });

  useEffect(() => {
    if (!route.params.filter) return;

    const { is_confirmed_info } = route.params.filter;

    const confirmInfoOption = find(CLIENT_CONFIRMED_INFO_OPTIONS, opt => {
      return is_confirmed_info === CLIENT_CONFIRMED_INFO_KEY_MAPPING[opt.key];
    });

    setFilter(preState => ({
      ...preState,
      confirmed_info: confirmInfoOption || CLIENT_CONFIRMED_INFO_OPTIONS[0],
    }));
  }, []);

  const onPressConfirmedInfoOptions = () => {
    SelectOptionModule.open({
      options: CLIENT_CONFIRMED_INFO_OPTIONS,
      onSelected: function (option: Option): void {
        setFilter?.({
          confirmed_info: option,
        });
      },
    });
  };

  const submit = () => {
    route.params.onChange?.({
      is_confirmed_info:
        CLIENT_CONFIRMED_INFO_KEY_MAPPING[filter.confirmed_info.key],
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Bộ lọc" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Input
          title="Trạng thái xác thực thông tin"
          placeholder="Không lọc"
          style={styles.input}
          rightButtons={[{ icon: images.common.chevronForward }]}
          editable={false}
          onPress={onPressConfirmedInfoOptions}
          value={filter.confirmed_info?.text}
        />
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text="Tiếp theo" onPress={submit} />
      </View>
    </View>
  );
};

export default ClientsFilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingBottom: 16,
  },
  checkboxIcon: {
    borderRadius: 4,
  },
  checkboxText: {
    marginLeft: 8,
    color: colors.color161616,
  },
  input: {
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
