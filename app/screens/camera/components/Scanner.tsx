import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import { FC, useRef } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import {
  Camera,
  CameraProps,
  Code,
  CodeType,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

interface Props extends ViewProps {
  codeTypes?: CodeType[];
  onCodeRead?: (code: string) => void;
  cameraProps?: Partial<CameraProps>;
}

const MyScanner: FC<Props> = ({
  codeTypes = [],
  style,
  children,
  cameraProps,
  ...props
}) => {
    const isFocused = useIsFocused()
  const appState = useAppState()
  const isActive = isFocused && appState === "active"

  const camera = useRef<Camera>(null);

  // camera device settings
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: codes => {
      onCodeScanned(codes);
    },
  });

  const onCodeScanned = (codes: Code[]) => {
    // console.log(`Scanned ${codes.length} codes!`);
    for (const code of codes) {
      if (code.value) {
        // console.log(`code ne`, code.value)
        onCodeRead(code.value);
      }
    }
  };

  const onCodeRead = debounce(
    (code: string) => {
      console.log(`onCodeRead`, code);
      props?.onCodeRead?.(code);
    },
    300,
    {
      leading: true,
      trailing: false,
    },
  );

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      {!hasPermission || !device ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colors.black,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Text style={{ color: colors.white }}>
            The camera is not available.
          </Text>
        </View>
      ) : (
        <Camera
          {...cameraProps}
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo={true}
          focusable
          codeScanner={codeScanner}
        />
      )}
      {children}
    </View>
  );
};

MyScanner.defaultProps = {
  codeTypes: ['code-128', 'ean-13', 'ean-8', 'qr'],
};

export default MyScanner;
