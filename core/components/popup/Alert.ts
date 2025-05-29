import { AlertProps } from './AlertPopup';
import Popup, { POPUP_TYPE, PopupOptions } from './Popup';

export interface IAlertOptions extends Partial<PopupOptions>, AlertProps {
  delay?: number;
}

const alert = (options: IAlertOptions) => {
  if (!options.title && !options.message && !options.image) return;

  const { delay, canDismiss, ...props } = options;

  setTimeout(
    () =>
      Popup.show({
        type: POPUP_TYPE.ALERT,
        canDismiss,
        props,
      }),
    delay || 100,
  );
};

export default { alert };
