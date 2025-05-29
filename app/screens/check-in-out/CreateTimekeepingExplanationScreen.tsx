import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { CreateTimekeepingExplanationDto } from '@app/interfaces/dtos/timekeeping-explanation.dto';
import { TimekeepingExplanationState } from '@app/interfaces/entities/timekeeping-explanation.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useAttendanceDetail } from '@app/queries/attendance.query';
import { createTimekeepingExplanationMutation } from '@app/queries/timekeeping-explanation.mutation';
import { useErpUserDetail } from '@app/queries/user.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import TimeUtils from '@core/utils/TimeUtils';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_TIMEKEEPING_EXPLANATION
>;

const CreateTimekeepingExplanationScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = createTimekeepingExplanationMutation();

  const { data: attendance, isRefetching: isRefetchingAttendance } =
    useAttendanceDetail(route.params.attendanceId);

  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>();

  useEffect(() => {
    if (mutation.isPending || isRefetchingAttendance) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [mutation.isPending, isRefetchingAttendance]);

  useEffect(() => {
    if (errors?.description) {
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);
    }
  }, [description]);

  const create = (state: TimekeepingExplanationState = '0_new') => {
    if (!attendance?.id || !user?.id) {
      return;
    }
    const explanation: CreateTimekeepingExplanationDto = {
      attendance_id: attendance.id,
      employee_id: user?.id,
      description,
      state,
      line_ids: {
        create: [
          {
            category: 'normal',
            date: attendance?.check_in_date,
            check_in: attendance.resource_calendar_id.hour_from,
            check_out: attendance.resource_calendar_id.hour_to,
          },
        ],
      },
    };
    mutation
      .mutateAsync(explanation)
      .then(({ response }) => {
        const result = response?.result?.timekeeping_explanation?.[0];

        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-timekeeping-explanation-list'],
        });

        navigation.dispatch(
          StackActions.replace(SCREEN.TIMEKEEPING_EXPLANATION_DETAIL, {
            id: result.id,
          }),
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (isEmpty(description)) {
      errors.description = 'Mô tả không được để trống';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const save = () => {
    if (!validate()) {
      return;
    }

    create();
  };

  const confirm = () => {
    if (!validate()) {
      return;
    }

    create('1_confirmed');
  };

  const checkInDate = attendance
    ? dayjs(attendance?.check_in_date, 'YYYY-MM-DD')
    : undefined;

  const hourFrom = useMemo(() => {
    if (!attendance?.resource_calendar_id?.hour_from) return '00:00';
    return TimeUtils.decimalHoursToHHMM(
      attendance?.resource_calendar_id?.hour_from,
    );
  }, [attendance?.resource_calendar_id]);

  const hourTo = useMemo(() => {
    if (!attendance?.resource_calendar_id?.hour_to) return '00:00';
    return TimeUtils.decimalHoursToHHMM(
      attendance?.resource_calendar_id?.hour_to,
    );
  }, [attendance?.resource_calendar_id]);

  return (
    <View style={styles.container}>
      <Header
        title="Giải trình công"
        headerRight={
          <View style={[styles.headerState]}>
            <Text style={[styles.headerStateText]}>Mới</Text>
          </View>
        }
      />

      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Input
          title="Nhân viên"
          placeholder="F00223323 - Nguyễn Văn A"
          style={styles.input}
          disabled
          value={attendance?.employee_id?.name}
        />
        <Input
          title="Chức vụ"
          placeholder="Nhân viên kinh doanh"
          style={styles.input}
          disabled
          value={attendance?.employee_id?.job_id?.name}
        />
        <Input
          title="Phòng ban"
          placeholder="Kinh doanh truyền thống"
          style={styles.input}
          disabled
          value={attendance?.employee_id?.department_id?.name}
        />
        <Input
          title="Lịch làm việc"
          placeholder="Full time 08h15-17h30"
          style={styles.input}
          disabled
          value={attendance?.resource_calendar_id?.name}
        />
        <Input
          title="Mô tả chi tiết"
          style={styles.input}
          onChangeText={setDescription}
          error={errors?.description}
        />
        <Input
          title="Người quản lý"
          placeholder="F003988 - Trần Quân"
          style={styles.input}
          disabled
          value={attendance?.employee_id?.parent_id?.name}
        />

        <Section
          title="Giải trình"
          bodyComponent={Fragment}
          style={styles.section}>
          <View style={styles.attendance}>
            <HStack style={styles.attendanceHeader}>
              <Text style={styles.attendanceDate} numberOfLines={1}>
                {checkInDate?.format('DD/MM/YYYY').toCapitalize() || ''}
              </Text>
              <View style={[styles.attendanceState]}>
                <Text style={[styles.stateText]} numberOfLines={1}>
                  Công bình thường
                </Text>
              </View>
            </HStack>

            <View style={styles.separator} />

            <View style={styles.attendanceBody}>
              <HStack style={[styles.attendanceRow]}>
                <Image source={images.common.timeFill} />
                <Text style={[styles.attendanceText]} numberOfLines={1}>
                  <Text style={styles.attendanceLabel}>Giờ vào</Text> {hourFrom}
                </Text>
                <Text
                  style={[styles.attendanceText, { textAlign: 'right' }]}
                  numberOfLines={1}>
                  <Text style={styles.attendanceLabel}>Giờ ra</Text> {hourTo}
                </Text>
              </HStack>
            </View>
          </View>
        </Section>
      </KeyboardAwareScrollView>

      <SafeAreaView edges={['bottom']}>
        <HStack style={styles.footer}>
          <Button
            text="Lưu"
            colors={colors.white}
            style={[
              styles.btn,
              { borderWidth: 1, borderColor: colors.primary },
            ]}
            textStyle={{ color: colors.primary }}
            onPress={save}
            disabled={mutation.isPending}
          />
          <Button
            text="Xác nhận"
            style={styles.btn}
            onPress={confirm}
            disabled={mutation.isPending}
          />
        </HStack>
      </SafeAreaView>
    </View>
  );
};

export default CreateTimekeepingExplanationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: colors.colorFFFFFF80,
  },
  headerStateText: {
    fontSize: 12,
    fontWeight: '400',
    maxWidth: Number(90).adjusted(),
    color: colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  section: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  input: {
    marginTop: 0,
  },
  attendance: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  attendanceHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  attendanceDate: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.color161616,
  },
  attendanceState: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.colorEAF4FB,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.color2651E5,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  attendanceBody: {
    paddingVertical: 16,
    gap: 8,
  },
  attendanceRow: {
    gap: 16,
  },
  attendanceLabel: {
    color: colors.color6B7A90,
  },
  attendanceText: {
    flex: 1,
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
