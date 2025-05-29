import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import images from '@images';
import {
  Calendar,
  useDateRange,
  toDateId,
  CalendarTheme,
  CalendarMonthEnhanced,
} from '@marceloterreiro/flash-calendar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListRenderItem } from '@shopify/flash-list';
import { View } from 'moti';
import React, { FunctionComponent, useEffect } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import getFontFamily from '@core/utils/getFontFamily';
import { colors } from '@core/constants/colors.constant';
import dayjs from 'dayjs';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CALENDAR_RANGE_PICKER
>;

const calendarTheme: CalendarTheme = {
  rowMonth: {
    content: {
      color: colors.color161616,
      fontFamily: getFontFamily('BeVietnamPro', { fontWeight: '700' }),
    },
  },
  itemWeekName: {
    content: {
      color: colors.color161616,
      fontFamily: getFontFamily('BeVietnamPro', { fontWeight: '600' }),
    },
  },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: colors.primary,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: 'transparent',
        borderRadius: 4,
      },
      content: {
        color: isWeekend ? colors.color16161680 : colors.color161616,
        fontFamily: getFontFamily('BeVietnamPro', {
          fontWeight: '400',
        }),
      },
    }),
    today: () => ({
      container: {
        // borderWidth: 1,
        borderColor: colors.color16161680,
      },
      content: {
        color: colors.color161616,
        fontFamily: getFontFamily('BeVietnamPro', {
          fontWeight: '500',
        }),
      },
    }),
    active: ({ isEndOfRange, isStartOfRange, isRangeValid }) => ({
      container: {
        backgroundColor: colors.primary,
        borderTopLeftRadius: isStartOfRange || !isRangeValid ? 16 : 0,
        borderBottomLeftRadius: isStartOfRange || !isRangeValid ? 16 : 0,
        borderTopRightRadius: isEndOfRange || !isRangeValid ? 16 : 0,
        borderBottomRightRadius: isEndOfRange || !isRangeValid ? 16 : 0,
      },
      content: {
        color: colors.white,
      },
    }),
  },
};

const FlashCalendarScreen: FunctionComponent<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { fromDate, toDate, onChangeDateRange, onClose } = route.params || {};

  const {
    calendarActiveDateRanges,
    onCalendarDayPress,
    // Also available for your convenience:
    dateRange, // { startId?: string, endId?: string }
    isDateRangeValid, // boolean
    onClearDateRange, // () => void
  } = useDateRange();

  useEffect(() => {
    onCalendarDayPress(toDateId(dayjs(fromDate).toDate()));
    onCalendarDayPress(toDateId(dayjs(toDate).toDate()));
  }, []);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener?.remove();
    };
  }, []);

  const onPressBack = () => {
    navigation.goBack();
    onClose?.();
    return true;
  };

  const submit = () => {
    console.log(`calendarActiveDateRanges`, calendarActiveDateRanges);
    console.log(`isDateRangeValid`, isDateRangeValid);
    console.log(`dateRange`, dateRange);

    const startId = dateRange.startId;
    const endId = dateRange.endId ?? dateRange.startId;

    onChangeDateRange?.({
      fromDate: dayjs(startId, 'YYYY-MM-DD').startOf('day').valueOf(),
      toDate: dayjs(endId, 'YYYY-MM-DD').endOf('day').valueOf(),
    });
    onPressBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Khoảng thời gian"
        leftButtons={[
          {
            icon: images.common.close,
            onPress: onPressBack,
          },
        ]}
        rightButtons={[
          {
            icon: images.common.check,
            onPress: submit,
          },
        ]}
      />
      <Calendar.List
        calendarFormatLocale="vi"
        calendarActiveDateRanges={calendarActiveDateRanges}
        onCalendarDayPress={onCalendarDayPress}
        pagingEnabled
        theme={calendarTheme}
        calendarFirstDayOfWeek="monday"
        calendarDayHeight={50}
        calendarMonthHeaderHeight={50}
        // calendarRowHorizontalSpacing={0}
        // calendarRowVerticalSpacing={4}
        // calendarSpacing={10}
      />
    </View>
  );
};

export default FlashCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  footer: {
    padding: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
});
