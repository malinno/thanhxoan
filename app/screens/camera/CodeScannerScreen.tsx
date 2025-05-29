import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MyScanner from './components/Scanner';
import {
  RECT_MASK_TOP_SPACE,
  RECT_SIZE,
  ScannerMask,
} from './components/ScannerMask';

const FLASH_SPACE = RECT_MASK_TOP_SPACE + RECT_SIZE + 24;

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CODE_SCANNER>;

const CodeScannerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [flash, setFlash] = useState(false);

  const toggleFlash = () => {
    setFlash(preState => !preState);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Quét mã vạch"
        style={{
          zIndex: 100,
          backgroundColor: 'transparent',
          ...StyleSheet.absoluteFillObject,
          bottom: undefined
        }}
      />
      <MyScanner
        cameraProps={{ torch: flash ? 'on' : 'off' }}
        onCodeRead={route.params.onCodeRead}>
        <ScannerMask />
      </MyScanner>
      <View style={styles.container}>
        <View style={styles.rect} />
        <Touchable
          style={[
            styles.flash,
            flash && {
              borderColor: colors.primary,
            },
          ]}
          onPress={toggleFlash}>
          <Image
            source={images.common.flash}
            style={
              flash && {
                tintColor: colors.primary,
              }
            }
          />
          <Text
            style={[
              styles.text,
              flash && {
                color: colors.primary,
              },
            ]}>
            Đèn flash
          </Text>
        </Touchable>
      </View>
    </View>
  );
};

export default CodeScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rect: {
    width: RECT_SIZE,
    height: RECT_SIZE,
    borderRadius: 10,
    marginTop: RECT_MASK_TOP_SPACE,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  topRightRadius: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  topLefttRadius: {
    position: 'absolute',
    top: -4,
    left: -4,
  },
  bottomRightRadius: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  bottomLeftRadius: {
    position: 'absolute',
    bottom: -4,
    left: -4,
  },
  flash: {
    position: 'absolute',
    top: FLASH_SPACE,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 12,
  },
  cameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
