import { colors } from '@core/constants/colors.constant';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useAppState } from '@react-native-community/hooks';
import CodePush, {
  DownloadProgress,
  RemotePackage,
} from 'react-native-code-push';
import { TIMEOUT_DURATION } from '@core/constants/core.constant';
import Text, { AnimatedText } from '@core/components/Text';
import LinearProgressBar from '@core/components/LinearProgressBar';
import HStack from './HStack';
import images from '@images';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import dayjs from 'dayjs';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const CHECK_INTERVAL = 30 * 60 * 1000;

const CodePushUpdate = () => {
  const dimension = useWindowDimensions();
  const appState = useAppState();
  const [isCheckingCodePush, setIsCheckingCodePush] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  const upToDate = useSharedValue(0);

  const _lastCheck = useRef<dayjs.Dayjs>();

  useEffect(() => {
    switch (appState) {
      case 'active': {
        const now = dayjs();
        const duration = _lastCheck.current && now.diff(_lastCheck.current);
        // console.log(`now`, now)
        // console.log(`_lastCheck.current`, _lastCheck.current)
        // console.log(`check interval`, CHECK_INTERVAL)
        // console.log(`duration`, duration)
        if (duration && duration < CHECK_INTERVAL) break;

        _lastCheck.current = now;
        upToDate.value = withTiming(0, { duration: 300 });
        checkCodePushUpdate();
        break;
      }
      default:
        break;
    }
  }, [appState]);

  const checkCodePushUpdate = async () => {
    try {
      await global.sleep(2000);
      if (__DEV__)
        throw new Error('This is dev env, no need to check codepush update');

      setIsCheckingCodePush(true);
      const remotePackage = await Promise.race([
        CodePush.checkForUpdate(),
        sleep(TIMEOUT_DURATION),
      ]);
      if (!remotePackage) throw new Error('empty or timeout');
      setIsCheckingCodePush(false);
      CodePush.allowRestart();

      const LocalPackage = await remotePackage.download(
        (progress: DownloadProgress) => {
          setProgress(progress.receivedBytes / progress.totalBytes);
          setDownloadedBytes(progress.receivedBytes);
          setTotalBytes(progress.totalBytes);
        },
      );

      console.info('NATIVE - CODE PUSH INSTALLING_UPDATE');

      await LocalPackage.install(CodePush.InstallMode.IMMEDIATE);
      await CodePush.notifyAppReady();
      CodePush.restartApp(true);
    } catch (error) {
      console.log(`CODE PUSH ERROR`, error);
      setIsCheckingCodePush(false);
      upToDate.value = withTiming(1, { duration: 300 });
    }
  };

  const fadeStyle = useAnimatedStyle(() => {
    return {
      // opacity: interpolate(upToDate.value, [0, 1], [1, 0]),
      right: interpolate(upToDate.value, [0, 0.99, 1], [0, 0, dimension.width]),
      bottom: interpolate(
        upToDate.value,
        [0, 0.99, 1],
        [0, 0, dimension.height],
      ),
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { overflow: 'hidden' }, fadeStyle]}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <Image
            source={images.common.appIcon}
            style={[styles.appIcon, { marginTop: dimension.height * 0.2 }]}
            resizeMode="contain"
          />
        </View>

        {isCheckingCodePush ? (
          <AnimatedText>Đang kiểm tra phiên bản</AnimatedText>
        ) : null}
        {Boolean(downloadedBytes) && (
          <LinearProgressBar
            colors={[colors.color2745D4, colors.primary]}
            progress={progress}
            linearDirection="horizontal"
            height={20}
            style={styles.progressBar}
            childrenContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 12,
                fontWeight: '700',
                color: colors.white,
              }}>
              {Math.floor(progress * 100)}%
            </Text>
          </LinearProgressBar>
        )}

        {Boolean(downloadedBytes) && (
          <Animated.View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[{ flex: 1 }]}>Đang tải xuống</Text>
            <Text>
              {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
            </Text>
          </Animated.View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

export default CodePushUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  appIcon: {
    alignSelf: 'center',
  },
  progressBar: {
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
  },
});
