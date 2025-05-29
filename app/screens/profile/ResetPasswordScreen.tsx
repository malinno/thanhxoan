import ApiErp from '@app/api/ApiErp';
import Input from '@app/components/Input';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { ResetPasswordDto } from '@app/interfaces/dtos/reset-password.dto';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import UserRepo from '@app/repository/user/UserRepo';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Alert from '@core/components/popup/Alert';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import { ValidationError } from '@core/interfaces/ValidationError';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type TChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.RESET_PASSWORD>;

const ResetPasswordScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordDto) => {
      return UserRepo.resetPassword(data);
    },
    onSuccess: ({ response, error }) => {
      if (
        error ||
        response?.error ||
        !response?.result ||
        response.result.message
      ) {
        throw error || response?.error || response?.result;
      }
    },
    onError: error => {
      console.log(`error`, error);
      const message = ApiErp.parseErrorMessage({
        error,
      });
      Alert.alert({ title: 'Thông báo', message });
    },
  });

  const [data, setData] = useState<TChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<ValidationError>({});

  // effects
  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [mutation.isPending]);

  useEffect(() => {
    setErrors(preState => {
      delete preState.currentPassword;
      return { ...preState };
    });
  }, [data.currentPassword]);

  useEffect(() => {
    setErrors(preState => {
      delete preState.newPassword;
      return { ...preState };
    });
  }, [data.newPassword]);

  useEffect(() => {
    setErrors(preState => {
      delete preState.confirmNewPassword;
      return { ...preState };
    });
  }, [data.confirmNewPassword]);

  const onChangeCurrentPassword = (currentPassword: string) =>
    setData(preState => ({ ...preState, currentPassword }));

  const onChangeNewPassword = (newPassword: string) =>
    setData(preState => ({ ...preState, newPassword }));

  const onChangeConfirmNewPassword = (confirmNewPassword: string) =>
    setData(preState => ({ ...preState, confirmNewPassword }));

  const validate = () => {
    let errors: Record<string, string> = {};
    if (isEmpty(data.currentPassword)) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu cũ';
    }
    if (isEmpty(data.newPassword)) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    }
    if (isEmpty(data.confirmNewPassword)) {
      errors.confirmNewPassword = 'Vui lòng xác nhận lại mật khẩu mới';
    }
    if (data.confirmNewPassword !== data.newPassword) {
      errors.confirmNewPassword = 'Mật khẩu mới không khớp';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const submit = () => {
    if (!validate() || !user?.id) return false;

    mutation
      .mutateAsync({
        old_password: data.currentPassword,
        password: data.newPassword,
        user_id: user.id,
      })
      .then(response => {
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Thông tin cá nhân" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Input
          style={[styles.input, { marginTop: 0 }]}
          title="Mật khẩu cũ"
          placeholder="Nhập mật khẩu cũ của bạn"
          onChangeText={onChangeCurrentPassword}
          error={errors?.currentPassword}
        />
        <Input
          style={styles.input}
          title="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          onChangeText={onChangeNewPassword}
          error={errors?.newPassword}
        />
        <Input
          style={styles.input}
          title="Nhập lại mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          onChangeText={onChangeConfirmNewPassword}
          error={errors?.confirmNewPassword}
        />

        <Button text="Lưu" onPress={submit} style={styles.button} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  input: {
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
});
