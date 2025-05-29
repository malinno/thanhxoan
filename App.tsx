import CodePushUpdate from '@app/components/CodePushUpdate';
import RootNavigator from '@app/navigators/RootNavigator';
import { persistor, store } from '@app/redux/store';
import Popup from '@core/components/popup/Popup';
import CommonPopup from '@core/components/popup/PopupContainer';
import SelectOption from '@core/components/selectPicker/SelectOption';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import SpinnerOverlay from '@core/components/spinnerOverlay/SpinnerOverlay';
import '@core/localize';
import { setCustomText } from '@core/utils/CustomStyles';
import Geolocation from '@react-native-community/geolocation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Keyboard, Platform, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setCustomScrollView } from 'react-native-global-props';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

Geolocation.setRNConfiguration({
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto',
  enableBackgroundLocationUpdates: false,
  skipPermissionRequests: false,
});

StatusBar.setBarStyle('light-content');
if (Platform.OS === 'android') {
  StatusBar.setBackgroundColor('transparent');
  StatusBar.setTranslucent(true);
}

setCustomText();

setCustomScrollView({
  keyboardShouldPersistTaps: 'handled',
  keyboardDismissMode: 'on-drag',
  onScrollBeginDrag: Keyboard.dismiss,
  contentInsetAdjustmentBehavior: 'never',
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: false,
      // staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      // refetchInterval: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider
          // persistOptions={{ persister: queryClientPersister }}
          client={queryClient}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <ToastProvider>
                <KeyboardProvider statusBarTranslucent>
                  <RootNavigator />
                  <CodePushUpdate />
                  <CommonPopup ref={Popup.setPopup} />
                  <SelectOption ref={SelectOptionModule.setPicker} />
                  <SpinnerOverlay ref={Spinner.setSpinner} />
                </KeyboardProvider>
              </ToastProvider>
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  version: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'right',
    color: 'red',
  },
  updateText: {
    textAlign: 'center',
  },
});

export default App;
