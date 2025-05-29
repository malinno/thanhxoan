import dimensions from '@core/constants/dimensions.constant';
import { Platform } from 'react-native';

declare global {
  interface Number {
    adjusted: () => number;
  }
}

Number.prototype.adjusted = function (rounded: boolean = true): number {
  const original = this.valueOf();
  const standardWidth = Platform.select({
    ios: 375,
    android: 414,
  });
  let value = (dimensions.width * original) / standardWidth!;
  if (rounded) value = Math.round(value);
  return value;
};
