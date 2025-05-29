import ApiErp from '@app/api/ApiErp';
import { useAuth } from '@app/hooks/useAuth';
import { useAuthForm } from '@app/hooks/useAuthForm';
import AuthRepo from '@app/repository/user/AuthRepo';
import Button from '@core/components/Button';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import AuthDivider from './AuthDivider';
import AuthInput, { AuthInputRef } from './AuthInput';
import { ValidationError } from '@core/interfaces/ValidationError';

const AuthByPassword = () => {
  const { t } = useTranslation();

  const setCookies = useAuth(state => state.setCookies);
  const setUser = useAuth(state => state.setUser);

  const username = useAuthForm(state => state.username);
  const setUsername = useAuthForm(state => state.setUsername);
  const password = useAuthForm(state => state.password);
  const setPassword = useAuthForm(state => state.setPassword);
  const [errors, setErrors] = useState<ValidationError>({});

  const _nameRef = useRef<AuthInputRef>(null);
  const _passwordRef = useRef<AuthInputRef>(null);

  const mutation = useMutation({
    mutationFn: () => AuthRepo.login({ username, password }),
    onSuccess: ({ response, headers, error }) => {
      if (error || !response?.result) throw response?.error || error;

      const cookies = headers?.['set-cookie'];

      setUser(response?.result);
      setCookies(cookies?.[0]);

      // const parsedCookies = cookies.map((cookie: string) =>
      //   CookieUtils.parseCookie(cookie),
      // );

      // console.log(`cookies`, cookies[0])
      // console.log(`parsedCookies`, parsedCookies);
    },
    onError: error => {
      console.log(`error`, error);
      const message = ApiErp.parseErrorMessage({
        error,
      });
      Alert.alert({ title: 'Thông báo', message });
    },
  });

  useEffect(() => {
    setErrors(state => {
      delete state.email;
      return state;
    });
  }, [username]);

  useEffect(() => {
    setErrors(state => {
      delete state.password;
      return state;
    });
  }, [password]);

  const validate = (): boolean => {
    let errors: Record<string, string> = {};
    if (isEmpty(username)) {
      errors.username = 'Tên đăng nhập không được để trống';
    }
    if (isEmpty(password)) {
      errors.password = 'Password không được để trống';
    }
    setErrors(errors);
    return isEmpty(errors);
  };

  const login = async () => {
    if (!validate()) return;

    mutation.mutate();
  };

  return (
    <Fragment>
      <AuthInput
        ref={_nameRef}
        prefix={images.auth.account}
        placeholder="Tài khoản ERP"
        style={[styles.input]}
        value={username}
        onChangeText={setUsername}
        error={errors.username}
        onSubmitEditing={() => _passwordRef.current?.focus()}
      />
      <AuthInput
        ref={_passwordRef}
        prefix={images.auth.password}
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        onSubmitEditing={login}
      />

      <Button
        text="Đăng nhập"
        style={[styles.button, { marginTop: 30 }]}
        onPress={login}
        loading={mutation.isPending}
      />
      <AuthDivider text="hoặc" />
      <Button
        text="Đăng nhập bằng OTP"
        colors={colors.white}
        style={[styles.button, styles.alternateSignInBtn]}
        textStyle={styles.alternateSignInText}
      />
    </Fragment>
  );
};

export default AuthByPassword;

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  button: {
    marginHorizontal: 24,
  },
  alternateSignInBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  alternateSignInText: {
    color: colors.primary,
  },
});
