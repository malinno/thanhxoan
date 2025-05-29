import { Image, StyleSheet, View } from 'react-native';
import React, { FC, memo, useMemo } from 'react';
import { colors } from '@core/constants/colors.constant';
import Text from '@core/components/Text';
import HStack from '@app/components/HStack';
import images from '@images';
import { TTimekeepingExplanationLine } from '@app/interfaces/entities/timekeeping-explanation.entity';
import dayjs from 'dayjs';
import TimeUtils from '@core/utils/TimeUtils';

type Props = {
  data: TTimekeepingExplanationLine;
};

const TimekeepingExplanationLine: FC<Props> = memo(({ data }) => {
  const checkInDate = data ? dayjs(data?.date, 'YYYY-MM-DD') : undefined;

  const checkInAt = useMemo(() => {
    if (!data?.check_in) return '00:00';
    return TimeUtils.decimalHoursToHHMM(data?.check_in);
  }, [data?.check_in]);

  const checkOutAt = useMemo(() => {
    if (!data?.check_out) return '00:00';
    return TimeUtils.decimalHoursToHHMM(data?.check_out);
  }, [data?.check_out]);

  return (
    <View style={styles.attendance}>
      <HStack style={styles.attendanceHeader}>
        <Text style={styles.attendanceDate} numberOfLines={1}>
          {checkInDate?.format('dddd - DD/MM/YYYY').toCapitalize() || ''}
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
            <Text style={styles.attendanceLabel}>Giờ vào</Text> {checkInAt}
          </Text>
          <Text
            style={[styles.attendanceText, { textAlign: 'right' }]}
            numberOfLines={1}>
            <Text style={styles.attendanceLabel}>Giờ ra</Text> {checkOutAt}
          </Text>
        </HStack>
      </View>
    </View>
  );
});

export default TimekeepingExplanationLine;

const styles = StyleSheet.create({
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
});
