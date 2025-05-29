import { ModalProps } from 'react-native-modal';
import { AlertProps } from './AlertPopup';
import { PopupRef } from './PopupContainer';
import { DefaultPopupProps } from './DefaultPopup';
import { BottomSheetPopupProps } from './BottomSheetPopup';

export enum POPUP_TYPE {
  DEFAULT = 'default',
  ALERT = 'alert',
  BOTTOM_SHEET = 'bottomSheet',
}

export interface PopupOptions {
  type: POPUP_TYPE;
  props: AlertProps | BottomSheetPopupProps | DefaultPopupProps;
  modalProps?: ModalProps;
  canDismiss?: boolean;
}

class Popup {
  private _popup?: PopupRef;

  setPopup = (popup: PopupRef) => {
    this._popup = popup;
  };

  show = (options: PopupOptions) => {
    this._popup?.show(options);
  };

  hide = () => {
    this._popup?.hide();
  };
}

export default new Popup();
