import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { Attendance } from '@app/interfaces/entities/attendance.entity';
import TimekeepingExplanationRepo from '@app/repository/check-in-out/TimekeepingExplanationRepo';
import Button from '@core/components/Button';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import TimeUtils from '@core/utils/TimeUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import React, { FC, memo, useMemo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

type Props = ViewProps & {
  index: number;
  data: Attendance;
  onPress?: (data: Attendance) => void;
  allowExplain?: boolean;
};

const AttendanceItem: FC<Props> = memo(
  ({ index, data, onPress, style, allowExplain, ...props }) => {
    const navigation = useNavigation();
    const user = useAuth(state => state.user);

    const _onPress = () => onPress?.(data);

    const _onPressExplanation = async () => {
      Spinner.show();
      const { response } = await TimekeepingExplanationRepo.fetchMany({
        attendance_id: data.id,
        page: 1,
      });
      Spinner.hide();

      if (response.timekeeping_explanation?.[0]?.id) {
        const explanationId = response.timekeeping_explanation?.[0]?.id;
        navigation.navigate(SCREEN.TIMEKEEPING_EXPLANATION_DETAIL, {
          id: explanationId,
        });
      } else if (
        response?.code === 404 ||
        !response?.timekeeping_explanation?.[0]?.id
      ) {
        navigation.navigate(SCREEN.CREATE_TIMEKEEPING_EXPLANATION, {
          attendanceId: data.id,
        });
      }
    };

    const checkInDate = dayjs(data.check_in_date, 'YYYY-MM-DD');

    const checkInAt = useMemo(() => {
      if (!data.check_in_hour) return '00:00';
      return TimeUtils.decimalHoursToHHMM(data.check_in_hour);
    }, [data.check_in_hour]);

    const checkOutAt = useMemo(() => {
      if (!data.check_out_hour) return '00:00';
      return TimeUtils.decimalHoursToHHMM(data.check_out_hour);
    }, [data.check_out_hour]);

    const lateTime = useMemo(() => {
      if (!data.late_attendance_hours) return '00:00';
      return TimeUtils.decimalHoursToHHMM(data.late_attendance_hours);
    }, [data.late_attendance_hours]);

    const earlyTime = useMemo(() => {
      if (!data.early_leave_hours) return '00:00';
      return TimeUtils.decimalHoursToHHMM(data.early_leave_hours);
    }, [data.early_leave_hours]);

    const workTime = useMemo(() => {
      if (!data.worked_hours) return '00:00';
      return TimeUtils.decimalHoursToHHMM(data.worked_hours);
    }, [data.worked_hours]);

    const validWorkTime = useMemo(() => {
      if (!data.valid_worked_hours) return '00:00';
      return TimeUtils.decimalHoursToHHMM(data.valid_worked_hours);
    }, [data.valid_worked_hours]);

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {checkInDate.format('dddd - DD/MM/YYYY').toCapitalize()}
          </Text>
          <View style={[styles.state]}>
            <Text style={[styles.stateText]} numberOfLines={1}>
              Công ngày: {String(data.worked_days_rate)}
            </Text>
          </View>
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row]}>
            <Image source={images.common.userCircle} />
            <Text
              style={[
                styles.text,
                { fontWeight: '700', color: colors.primary },
              ]}
              numberOfLines={1}>
              {data.employee_id?.name}
            </Text>
          </HStack>

          <HStack style={[styles.row]}>
            <Image source={images.common.timeFill} />
            <Text style={[styles.text]} numberOfLines={1}>
              <Text style={styles.label}>Giờ vào</Text> {checkInAt}
            </Text>
            <Text
              style={[styles.text, { textAlign: 'right' }]}
              numberOfLines={1}>
              <Text style={styles.label}>Giờ ra</Text> {checkOutAt}
            </Text>
          </HStack>

          <HStack style={[styles.row]}>
            <Image source={images.common.timeProgress} />
            <Text style={[styles.text]} numberOfLines={1}>
              <Text style={styles.label}>Đến muộn</Text> {lateTime}
            </Text>
            <Text
              style={[styles.text, { textAlign: 'right' }]}
              numberOfLines={1}>
              <Text style={styles.label}>Về sớm</Text> {earlyTime}
            </Text>
          </HStack>

          <HStack style={[styles.row]}>
            <Image source={images.common.timeProgressDuotone} />
            <Text style={[styles.text]} numberOfLines={1}>
              <Text style={styles.label}>Làm việc</Text> {workTime}
            </Text>
            <Text
              style={[styles.text, { textAlign: 'right' }]}
              numberOfLines={1}>
              <Text style={styles.label}>Hợp lệ</Text> {validWorkTime}
            </Text>
          </HStack>

          <HStack style={[styles.row]}>
            <Image source={images.client.calendar} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.resource_calendar_id?.name}
            </Text>
          </HStack>

          {data.worked_days_rate < 1.0 && allowExplain && (
            <Button
              text="Giải trình công"
              style={styles.btn}
              textStyle={{ fontSize: 14, fontWeight: '600' }}
              onPress={_onPressExplanation}
            />
          )}
        </View>
      </Touchable>
    );
  },
);

AttendanceItem.defaultProps = {
  allowExplain: true,
};

export default AttendanceItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  name: {
    flex: 1,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.color161616,
  },
  state: {
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
  body: {
    paddingVertical: 16,
    gap: 8,
  },
  row: {
    gap: 16,
  },
  label: {
    color: colors.color6B7A90,
  },
  text: {
    flex: 1,
  },
  btn: {
    minHeight: undefined,
    height: 36,
    paddingVertical: 0,
  },
});
