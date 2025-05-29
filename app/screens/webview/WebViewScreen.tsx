import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import Touchable, { AnimatedTouchable } from '@core/components/Touchable';
import images from '@images';
import {
  WebViewErrorEvent,
  WebViewMessageEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Image } from 'react-native-reanimated/lib/typescript/Animated';
import AnimatedProgressBar from '@core/components/AnimatedProgressBar';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.WEBVIEW>;

const WebViewScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { url } = route.params || {};

  const [loadProgress, setLoadProgress] = useState<number>(0);

  const _webviewRef = useRef<WebView>(null);
  const _canGoBack = useRef(false);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener?.remove();
    };
  }, []);

  const onPressBack = useCallback(() => {
    if (_canGoBack.current) _webviewRef.current?.goBack();
    else navigation.goBack();
    return true;
  }, []);

  const onLoadStart = useCallback((event: WebViewNavigationEvent) => {}, []);

  const onLoadEnd = useCallback(
    (event: WebViewNavigationEvent | WebViewErrorEvent) => {},
    [],
  );

  const onMessage = useCallback((event: WebViewMessageEvent) => {}, []);

  const onNavigationStateChange = useCallback((event: WebViewNavigation) => {
    _canGoBack.current = event.canGoBack;
    console.log(`on navigation state change url`, event.url);
  }, []);

  const onLoadProgress = useCallback((event: WebViewProgressEvent) => {
    const percent = event.nativeEvent.progress;
    setLoadProgress(percent);
  }, []);

  // let params = qs.stringify({
  //   hideHeader: 1,
  //   fromApp: 1,
  //   access_token: accessToken?.replace('Bearer ', ''),
  //   statusBarHeight: getStatusBarHeight(),
  // });

  // let source = {
  //   uri: `${uri}?${params}`,
  //   html,
  // };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.container}>
        <WebView
          ref={_webviewRef}
          javaScriptEnabled={true}
          source={{ uri: url }}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onMessage={onMessage}
          onLoadProgress={onLoadProgress}
          directionalLockEnabled
          onNavigationStateChange={onNavigationStateChange}
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          originWhitelist={['*']}
          scalesPageToFit={Platform.OS === 'android'}
          injectedJavaScript={`
            var meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            document.getElementsByTagName('head')[0].appendChild(meta);
          `}
          bounces={false}
          renderLoading={() => (
            <View style={[styles.progressBarContainer]}>
              <AnimatedProgressBar
                percentage={loadProgress || 0.1}
                height={2}
                color="yellow"
                fulfillColor="yellow"
              />
            </View>
          )}
        />
      </SafeAreaView>

      {navigation.canGoBack() && (
        <TouchableWithoutFeedback
          // entering={FadeIn}
          // exiting={FadeOut}
          // activeOpacity={1}
          onPress={onPressBack}>
          <View style={[styles.backBtn, { top: insets.top + 4 }]}>
            <Animated.Image
              source={images.common.chevronLeft}
              tintColor={colors.colorDADADA}
              style={{ width: 40, height: 40 }}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.color0A3789,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    left: 12,
    elevation: 4,
    shadowColor: '#B1B1B14D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
    zIndex: 100,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
});
