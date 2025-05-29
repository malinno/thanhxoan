import Input from '@app/components/Input';
import { HASHED_SECRET } from '@app/constants/app.constant';
import { useDevMode } from '@app/hooks/useDevMode';
import Button from '@core/components/Button';
import Popup from '@core/components/popup/Popup';
import { colors } from '@core/constants/colors.constant';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import crypto from 'react-native-quick-crypto';

const EnterDevMode = () => {
  const setDevMode = useDevMode(state => state.setDevMode);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setError(undefined);
  }, [code]);

  const submit = () => {
    if (isEmpty(code)) {
      return setError('Invalid code');
    }
    const hashedSecret = crypto.createHash('sha256').update(code).digest('hex');
    if (hashedSecret !== HASHED_SECRET) {
      return setError('Invalid code');
    }
    setDevMode(true);
    Popup.hide();
  };

  return (
    <View style={styles.container}>
      <Input
        title={'Secret'}
        value={code}
        onChangeText={setCode}
        error={error}
      />
      <Button text="Xác nhận" colors={colors.primary} onPress={submit} />
    </View>
  );
};

export default EnterDevMode;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },
});
