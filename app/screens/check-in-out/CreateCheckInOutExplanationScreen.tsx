import { Keyboard, StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import { StackActions, useNavigation } from '@react-navigation/native';
import Header from '@core/components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Input from '@app/components/Input';
import images from '@images';
import Button from '@core/components/Button';
import { useCheckInOutReasons } from '@app/queries/check-in-out-explanation.query';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import dimensions from '@core/constants/dimensions.constant';
import { createCheckInOutExplanationMutation } from '@app/queries/check-in-out-explanation.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { isEmpty } from 'lodash';
import { queryClient } from 'App';
import { ValidationError } from '@core/interfaces/ValidationError';

export type CheckInOutExplanationForm = {
  reason?: [number, string];
  note?: string;
};

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_CHECK_IN_OUT_EXPLANATION
>;

const CreateCheckInOutExplanationScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const mutation = createCheckInOutExplanationMutation();
  const { data: reasons } = useCheckInOutReasons();

  const [data, setData] = useState<CheckInOutExplanationForm>({});
  const [errors, setErrors] = useState<ValidationError>({});

  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending]);

  useEffect(() => {
    if (mutation.isSuccess) {
      navigation.goBack();
    }
  }, [mutation.isSuccess]);

  const onChangeNote = (note: string) =>
    setData(preState => ({
      ...preState,
      note,
    }));

  const onPressReasons = () => {
    if (!reasons) return;
    const options: Option[] = reasons?.map(it => ({
      key: it.id,
      text: it.reason,
    }));
    SelectOptionModule.open({
      title: 'Chọn lý do',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option): void {
        setData(preState => ({
          ...preState,
          reason: [Number(option.key), option.text],
        }));
      },
    });
  };

  const validate = () => {
    Keyboard.dismiss()
    let errors: Record<string, string> = {};
    if (isEmpty(data?.reason)) {
      errors.reason = 'Chưa chọn lý do';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const submit = () => {
    if (!validate()) return;

    mutation
      .mutateAsync({
        id: route.params.checkInOutId,
        data: {
          reason_cico_id: Number(data.reason?.[0]),
          reason_explanation: data.note,
        },
      })
      .then(({ response }) => {
        const result = response?.result?.checkin_out_explanation?.[0];
        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-check-in-out-explanations-list'],
        });
        navigation.dispatch(
          StackActions.replace(SCREEN.CHECK_IN_OUT_EXPLANATION_DETAIL, {
            id: result.id,
          }),
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Giải trình check in - out" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Input
          style={[styles.input, { marginTop: 0 }]}
          title="Lý do giải trình"
          placeholder="Mất kết nối internet"
          rightButtons={[{ icon: images.common.chevronForward }]}
          editable={false}
          onPress={onPressReasons}
          value={data.reason?.[1]}
          error={errors.reason}
        />
        <Input
          style={[styles.input]}
          inputStyle={styles.note}
          title="Chi tiết lý do giải trình"
          placeholder="Không có tiền nạp 4G"
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          onChangeText={onChangeNote}
        />
        <Button text="Xác nhận" style={styles.button} onPress={submit} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreateCheckInOutExplanationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  input: {
    marginTop: 16,
  },
  note: {
    height: 80,
  },
  button: {
    marginTop: 16,
  },
});
