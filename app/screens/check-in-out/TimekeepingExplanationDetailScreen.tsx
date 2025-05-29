import Input from '@app/components/Input';
import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useTimekeepingExplanationDetail } from '@app/queries/timekeeping-explanation.query';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import TimekeepingExplanationLine from './components/TimekeepingExplanationLine';
import { TIMEKEEPING_EXPLANATION_STATE_MAPPING } from '@app/constants/timekeeping-explanation.constant';
import { isNil } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@core/components/Button';
import { TimekeepingExplanationStateDto } from '@app/interfaces/dtos/timekeeping-explanation.dto';
import {
  updateTimekeepingExplanationMutation,
  updateTimekeepingExplanationStateMutation,
} from '@app/queries/timekeeping-explanation.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { queryClient } from 'App';
import HStack from '@app/components/HStack';
import Text from '@core/components/Text';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.TIMEKEEPING_EXPLANATION_DETAIL
>;

const TimekeepingExplanationDetailScreen: FC<Props> = ({ route, ...props }) => {
  const user = useAuth(state => state.user);

  const { data: explanation } = useTimekeepingExplanationDetail(
    route.params.id,
  );
  const stateMutation = updateTimekeepingExplanationStateMutation();
  const editMutation = updateTimekeepingExplanationMutation();

  const [description, setDescription] = useState('');

  // effects
  useEffect(() => {
    if (stateMutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [stateMutation.isPending]);

  useEffect(() => {
    setDescription(explanation?.description ?? '');
  }, [explanation?.description]);

  const onPressSave = () => {
    if (!explanation?.id) return;

    editMutation
      .mutateAsync({
        id: explanation.id,
        data: { description },
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-timekeeping-explanation-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['fetch-timekeeping-explanation-detail'],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onPressConfirm = () => {
    updateState('confirm');
  };

  const onPressReject = () => {
    updateState('reject');
  };

  const onPressApprove = () => {
    updateState('approve');
  };

  const onPressReset = () => {
    updateState('reset_to_new');
  };

  const onPressCancel = () => {
    updateState('cancel');
  };

  const updateState = (state: TimekeepingExplanationStateDto) => {
    if (!explanation?.id || !user?.id) return;

    stateMutation
      .mutateAsync({
        id: explanation.id,
        state,
        uid: user?.id,
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-timekeeping-explanation-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['fetch-timekeeping-explanation-detail'],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const status = explanation?.state
    ? TIMEKEEPING_EXPLANATION_STATE_MAPPING[explanation?.state]
    : undefined;

  return (
    <View style={styles.container}>
      <Header
        title="Giải trình công"
        headerRight={
          !isNil(status) && (
            <View
              style={[
                styles.headerState,
                { backgroundColor: status.backgroundColor },
              ]}>
              <Text
                style={[styles.headerStateText, { color: status.textColor }]}
                numberOfLines={1}>
                {status?.displayText}
              </Text>
            </View>
          )
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
          value={explanation?.employee_id?.name}
        />
        <Input
          title="Chức vụ"
          placeholder="Nhân viên kinh doanh"
          style={styles.input}
          disabled
          value={explanation?.job_id?.name}
        />
        <Input
          title="Phòng ban"
          placeholder="Kinh doanh truyền thống"
          style={styles.input}
          disabled
          value={explanation?.department_id?.name}
        />
        <Input
          title="Lịch làm việc"
          placeholder="Full time 08h15-17h30"
          style={styles.input}
          disabled
        />
        <Input
          title="Mô tả chi tiết"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          disabled={!explanation || explanation.state !== '0_new'}
        />
        <Input
          title="Người quản lý"
          placeholder="F003988 - Trần Quân"
          style={styles.input}
          disabled
          value={explanation?.parent_id?.name}
        />

        {explanation?.line_ids && (
          <Section
            title="Giải trình"
            bodyComponent={Fragment}
            style={styles.section}>
            {explanation?.line_ids?.map((line, index) => {
              return (
                <TimekeepingExplanationLine
                  key={`${line.date}_${index}`}
                  data={line}
                />
              );
            })}
          </Section>
        )}
      </KeyboardAwareScrollView>
      <SafeAreaView edges={[]} style={styles.footer}>
        {explanation?.state === '0_new' && (
          <HStack style={{ gap: 12 }}>
            <Button
              text="Lưu"
              colors={colors.white}
              style={[
                styles.button,
                { borderWidth: 1, borderColor: colors.primary, flex: 1 },
              ]}
              textStyle={{ color: colors.primary }}
              onPress={onPressSave}
            />
            <Button
              text="Xác nhận"
              style={[styles.button, { flex: 1 }]}
              onPress={onPressConfirm}
            />
          </HStack>
        )}

        {explanation?.state &&
          [
            '0_new',
            '1_confirmed',
            '2_approved_first',
            '3_approved_second',
          ].includes(explanation.state) && (
            <Button
              text="Huỷ"
              style={[styles.button, styles.cancelButton]}
              colors={colors.colorFB4646}
              onPress={onPressCancel}
            />
          )}

        {explanation?.state &&
          ['1_confirmed', '2_approved_first'].includes(explanation.state) && (
            <HStack style={{ gap: 12 }}>
              <Button
                text="Huỷ duyệt"
                colors={colors.red}
                style={[styles.button, { flex: 1 }]}
                onPress={onPressReject}
              />

              <Button
                text="Duyệt"
                colors={colors.color2AB514}
                style={[styles.button, { flex: 1 }]}
                onPress={onPressApprove}
              />
            </HStack>
          )}
        {explanation?.state &&
          ['4_rejected', '5_canceled'].includes(explanation?.state) && (
            <Button
              text="Đặt về dự thảo"
              colors={colors.white}
              style={[
                styles.button,
                { borderWidth: 1, borderColor: colors.primary },
              ]}
              textStyle={{ color: colors.primary }}
              onPress={onPressReset}
            />
          )}
      </SafeAreaView>
    </View>
  );
};

export default TimekeepingExplanationDetailScreen;

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
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  cancelButton: {},
  button: {},
});
