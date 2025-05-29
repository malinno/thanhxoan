import { colors } from '@core/constants/colors.constant';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Text from '../Text';

export type SpinnerOverlayRef = {
  show: () => void;
  hide: () => void;
};

interface Props {}

const SpinnerOverlay = forwardRef((props: Props, ref) => {
  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    show: () => _show(),
    hide: () => _hide(),
  }));

  const _show = () => {
    setLoading(true);
  };

  const _hide = () => {
    setLoading(false);
  };

  return (
    <Spinner
      visible={loading}
      customIndicator={
        <View style={styles.indicatorContainer}>
          <ActivityIndicator color={colors.white} size="large" />
          <Text style={styles.indicatorText}>Đang tải</Text>
        </View>
      }
    />
  );
});

const styles = StyleSheet.create({
  indicatorContainer: {
    width: 110,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#000000ac',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorText: {
    width: 100,
    marginTop: 10,
    fontSize: 15,
    color: colors.white,
    textAlign: 'center',
  },
});

export default SpinnerOverlay;
