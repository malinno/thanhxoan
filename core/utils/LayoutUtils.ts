import {isIphoneX} from 'react-native-iphone-x-helper';
import {Dimensions, Platform, StatusBar} from 'react-native';

const {width, height} = Dimensions.get('window');

const standardLength = width > height ? width : height;
const offset =
  width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const deviceHeight =
  isIphoneX() || Platform.OS === 'android'
    ? standardLength - offset!
    : standardLength;

export default class LayoutUtils {
  static size = (
    original: number,
    rounded: boolean = true,
  ): number => {
    const standardWidth = Platform.select({
      ios: 375,
      android: 414,
    });
    let value = (width * original) / standardWidth!;
    if (rounded) value = Math.round(value);
    return value;
  };

  static fontSize = (
    fontSize: number,
    standardScreenHeight: number = 680,
  ): number => {
    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
  };
}
