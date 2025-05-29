import Button from '@core/components/Button';
import { colors } from '@core/constants/colors.constant';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';

interface Props extends Omit<Partial<DatePickerProps>, 'date'> {
  date: number;
  onSelected?: (date: number) => void;
}

const DatePickerSheet: React.FunctionComponent<Props> = props => {
  const { date: pDate, ...rest } = props;
  const [date, setDate] = useState<Date>(new Date(pDate));
  const { onSelected } = props;

  const _submit = () => {
    onSelected?.(date.getTime());
  };

  return (
    <View style={styles.container}>
      <DatePicker
        locale="vi"
        mode="datetime"
        date={date}
        onDateChange={setDate}
        style={{ alignSelf: 'center' }}
        // androidVariant="nativeAndroid"
        is24hourSource="locale"
        theme={'light'}
        {...rest}
      />
      <View style={styles.actions}>
        <Button
          onPress={_submit}
          text="Xác nhận"
          colors={[colors.primary]}
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
};

export default DatePickerSheet;

const styles = StyleSheet.create({
  container: {},
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  nextBtn: {
    flex: 1,
  },
});
