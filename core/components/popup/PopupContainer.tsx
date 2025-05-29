import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import AlertPopup from './AlertPopup';
import DefaultPopup from './DefaultPopup';
import { PopupOptions, POPUP_TYPE } from './Popup';
import BottomSheetPopup from './BottomSheetPopup';

export type PopupRef = {
  show: (options: PopupOptions) => void;
  hide: () => void;
};

interface Props {}

const CommonPopup = forwardRef((props: Props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<PopupOptions>();
  const { type, modalProps, canDismiss } = options || {};

  useImperativeHandle(ref, () => ({
    show: (options: PopupOptions) => _show(options),
    hide: () => _hide(),
  }));

  const _show = (options: PopupOptions) => {
    setOptions(options);
    setVisible(true);
  };

  const _hide = () => {
    setVisible(false);
    setOptions(undefined);
  };

  const _children = useMemo(() => {
    switch (type) {
      case POPUP_TYPE.ALERT:
        return <AlertPopup {...options?.props} />;
      case POPUP_TYPE.BOTTOM_SHEET:
        return <BottomSheetPopup {...options?.props} />;
      case POPUP_TYPE.DEFAULT:
      default:
        return <DefaultPopup />;
    }
  }, [options]);

  const style: StyleProp<ViewStyle> = [
    styles.modal,
    options?.type === POPUP_TYPE.ALERT && styles.alertModal,
    options?.type === POPUP_TYPE.BOTTOM_SHEET && styles.bottomSheet,
  ];

  const animationIn = useMemo(() => {
    switch (type) {
      case POPUP_TYPE.ALERT:
        return 'fadeIn';
      case POPUP_TYPE.BOTTOM_SHEET:
        return 'fadeInUp';
      case POPUP_TYPE.DEFAULT:
      default:
        break;
    }
    return;
  }, [type]);

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      animationIn={animationIn}
      style={style}
      onBackButtonPress={canDismiss === false ? undefined : _hide}
      onBackdropPress={canDismiss === false ? undefined : _hide}
      hideModalContentWhileAnimating
      {...modalProps}>
      {_children}
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {},
  alertModal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default CommonPopup;
