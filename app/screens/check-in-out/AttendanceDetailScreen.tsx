import { StyleSheet, View } from 'react-native'
import React, { FC } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import Header from '@core/components/Header';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ATTENDANCE_DETAIL
>;

const AttendanceDetailScreen: FC<Props> = ({route, ...props}) => {
  return (
    <View style={styles.container}>
        <Header title='Chi tiết chấm công'/>
    </View>
  )
}

export default AttendanceDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})