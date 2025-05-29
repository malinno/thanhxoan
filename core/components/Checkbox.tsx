import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import BouncyCheckbox, {
  IBouncyCheckboxProps,
} from 'react-native-bouncy-checkbox';
import Animated from 'react-native-reanimated';

interface ICheckboxProps extends IBouncyCheckboxProps {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  value: boolean;
}

class Checkbox extends React.Component<ICheckboxProps> {
  static defaultProps: ICheckboxProps = {
    value: false,
    size: 20,
  };

  private checkboxRef: BouncyCheckbox | null;
  private setCheckboxRef: Function;

  constructor(props: ICheckboxProps | Readonly<ICheckboxProps>) {
    super(props);

    this.checkboxRef = null;

    this.setCheckboxRef = (element: BouncyCheckbox) => {
      this.checkboxRef = element;
    };
  }

  onPress() {
    this.checkboxRef?.onPress();
  }

  render() {
    const { value, children, textStyle, size, ...rest } = this.props;
    return (
      <BouncyCheckbox
        // @ts-ignore
        ref={this.setCheckboxRef}
        isChecked={value}
        iconStyle={[styles.icon, this.props.disabled && {borderColor: colors.colorC4C4C4}]}
        size={Number(size).adjusted()}
        textStyle={[styles.text, textStyle]}
        textContainerStyle={{ marginLeft: 0 }}
        unfillColor={colors.white}
        fillColor={colors.primary}
        textComponent={children}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    color: colors.color161616,
  },
});

export const AnimatedCheckbox = Animated.createAnimatedComponent(Checkbox);

export default Checkbox;
