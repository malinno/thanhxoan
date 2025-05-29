import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Text from '@core/components/Text';
import images from '@images';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { SignInMethod } from '@app/enums/sign-in-method';
import AuthByPassword from './components/AuthByPassword';
import AuthByPhone from './components/AuthByPhone';
import AuthDivider from './components/AuthDivider';
import AuthInput from './components/AuthInput';
import Button from '@core/components/Button';
import { colors } from '@core/constants/colors.constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const AuthScreen = () => {
  const [method, setMethod] = useState<SignInMethod>(SignInMethod.password);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bottomOffset={50}
        bounces={false}>
        <Image
          source={images.common.appIcon}
          style={styles.appIcon}
          resizeMode="contain"
        />

        {method === SignInMethod.password ? (
          <AuthByPassword />
        ) : (
          <AuthByPhone />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  appIcon: {
    alignSelf: 'center',
    marginTop: getStatusBarHeight(true),
  },
});
