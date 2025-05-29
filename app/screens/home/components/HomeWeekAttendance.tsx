import { useAuth } from '@app/hooks/useAuth';
import { useInfiniteAttendanceList } from '@app/queries/attendance.query';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { isEmpty } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { InteractionManager, StyleSheet, View, ViewProps } from 'react-native';

const getCurrentWeekDates = () => {
  dayjs.locale('vi')
  const today = dayjs();
  const startOfWeek = today.startOf('week');
  const dates = [];

  for (let i = 0; i < 7; i++) {
    dates.push(startOfWeek.add(i, 'day'));
  }

  return dates;
};
const currentWeekDates = getCurrentWeekDates();

type TAttendanceDate = {
  day: string;
  value: number;
};

type Props = ViewProps & {};

const HomeWeekAttendance: FC<Props> = ({ style, ...props }) => {
  const user = useAuth(state => state.user);

  const [dates, setDates] = useState<TAttendanceDate[]>([]);
  const { data, refetch } = useInfiniteAttendanceList(
    {
      from_date: currentWeekDates[0].format('YYYY-MM-DD'),
      to_date:
        currentWeekDates[currentWeekDates.length - 1].format('YYYY-MM-DD'),
      employee_id: user?.id,
    },
    false,
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (user?.id) refetch();
      });

      return () => task.cancel();
    }, [user]),
  );

  useEffect(() => {
    const lookup = data?.pages?.reduce((prev: Record<string, number>, page) => {
      for (const attendance of page) {
        const key = attendance.check_in_date;
        prev[key] = attendance.worked_days_rate;
      }
      return prev;
    }, {});
    setDates(
      currentWeekDates.reduce((prev: TAttendanceDate[], it) => {
        const day = it.format('YYYY-MM-DD');
        const value = lookup?.[day] || 0;
        prev.push({
          day: it.format('dd'),
          value,
        });
        return prev;
      }, []),
    );
  }, [data]);

  if (isEmpty(dates)) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chấm công trong tuần</Text>
      </View>
      <View style={styles.weekContainer}>
        {dates.map((item, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.day}>{item.day}</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{item.value.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 16,
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerText: {
    textAlign: 'center',
    color: colors.color2745D4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: colors.colorDADADA,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 4,
  },
  day: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueContainer: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.colorEFF0F4,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 12,
    color: colors.black,
  },
});

export default HomeWeekAttendance;
