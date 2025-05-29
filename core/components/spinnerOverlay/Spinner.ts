import { LegacyRef } from "react";
import { SpinnerOverlayRef } from "./SpinnerOverlay";

class Spinner {
  private _spinner?: SpinnerOverlayRef | null;

  setSpinner = (spinner: SpinnerOverlayRef | null) => {
    this._spinner = spinner;
  };

  show = () => {
    this._spinner?.show();
  };

  hide = () => {
    this._spinner?.hide();
  };
}

export default new Spinner();
