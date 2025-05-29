declare global {
  var appName: string;
  var _SHOWING_MODAL_: boolean;
  function sleep(ms: number): Promise<void>;
  function equalIgnoreCase(string1: string, string2: string): boolean;
}

global.sleep = function (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

global.equalIgnoreCase = function (string1: string, string2: string): boolean {
  return string1.toUpperCase() === string2.toUpperCase();
};

export { };

