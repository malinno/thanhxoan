import { SelectOptionParams, SelectOptionRef } from "./SelectPicker.interface";

class SelectOptionModule {
  private _selectOption?: SelectOptionRef;

  setPicker = (selectPicker: SelectOptionRef) => {
    this._selectOption = selectPicker;
  };

  open = (options: SelectOptionParams) => {
    this._selectOption?.open(options);
  };

  close = () => {
    this._selectOption?.close();
  };
}

export default new SelectOptionModule();
