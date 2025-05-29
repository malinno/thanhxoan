import Input from '@app/components/Input';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button from '@core/components/Button';
import Checkbox from '@core/components/Checkbox';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ATTENDANCES_FILTER
>;

type AttendancesFilterViewModel = {
  isFullAttendance?: boolean;
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
};

const AttendancesFilterScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const [filter, setFilter] = useState<AttendancesFilterViewModel>({});

  useEffect(() => {
    if (!route.params?.filter) return;

    const { from_date, to_date, full_attendance } = route.params.filter;

    setFilter(preState => ({
      ...preState,
      isFullAttendance: full_attendance ?? undefined,
      from: from_date ? dayjs(from_date, 'YYYY-MM-DD') : undefined,
      to: to_date ? dayjs(to_date, 'YYYY-MM-DD') : undefined,
    }));
  }, []);

  const toggleIsFullAttendance = () => {
    setFilter(preState => ({
      ...preState,
      isFullAttendance: !preState.isFullAttendance,
    }));
  };

  const clearDateRange = () =>
    setFilter(preState => ({ ...preState, from: undefined, to: undefined }));

  const onPressCalendar = () => {
    navigation.navigate(SCREEN.CALENDAR_RANGE_PICKER, {
      fromDate: filter.from?.valueOf(),
      toDate: filter.to?.valueOf(),
      onChangeDateRange: (date: { fromDate: number; toDate: number }) => {
        setFilter(preState => ({
          ...preState,
          from: dayjs(date.fromDate),
          to: dayjs(date.toDate),
        }));
      },
    });
  };

  const submit = () => {
    route.params?.onChange?.({
      from_date: filter.from?.format('YYYY-MM-DD'),
      to_date: filter.to?.format('YYYY-MM-DD'),
      full_attendance: filter.isFullAttendance ? true : undefined,
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
        <Checkbox
          disableBuiltInState
          style={styles.input}
          iconStyle={styles.checkboxIcon}
          value={filter.isFullAttendance}
          textComponent={<Text style={styles.checkboxText}>Đủ công</Text>}
          onPress={toggleIsFullAttendance}
        />

        <Input
          title="Thời gian từ - đến"
          placeholder="Chọn khoảng thời gian"
          style={[styles.input]}
          editable={false}
          rightButtons={[
            isNil(filter.from)
              ? { icon: images.common.calendarFilled }
              : {
                  icon: images.common.close,
                  iconStyle: {
                    width: 16,
                    height: 16,
                    tintColor: colors.color6B7A90,
                  },
                  onPress: clearDateRange,
                },
          ]}
          onPress={onPressCalendar}
          value={
            filter.from && filter.to
              ? [
                  filter.from.format('DD/MM/YYYY'),
                  filter.to.format('DD/MM/YYYY'),
                ].join(' - ')
              : ''
          }
        />
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <Button text="Tiếp theo" onPress={submit} />
      </View>
    </View>
  );
};

export default AttendancesFilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
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
    marginTop: 16,
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});
