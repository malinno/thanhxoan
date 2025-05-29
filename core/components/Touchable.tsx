import { debounce } from 'lodash';
import React, { ComponentClass, PureComponent, forwardRef } from 'react';
import {
  GestureResponderEvent,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableOpacityProps,
  Pressable as RNPressable,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

export interface TouchableProps extends TouchableOpacityProps {
  debounce?: number;
}

function withPreventDoubleClick<T extends TouchableProps>(
  WrappedComponent: ComponentClass<T>,
) {
  type WrappedComponentInstance = InstanceType<typeof WrappedComponent>;

  type WrapperComponentPropsWithForwardedRef = TouchableProps & {
    forwardedRef?: React.Ref<WrappedComponentInstance>;
  };

  class PreventDoubleClick extends PureComponent<WrapperComponentPropsWithForwardedRef> {
    static displayName: string;
    private ref: any;

    debouncedOnPress = (event: GestureResponderEvent) => {
      this.props.onPress?.(event);
    };

    onPress =
      this.props.debounce === 0
        ? this.props.onPress
        : debounce(this.debouncedOnPress, this.props.debounce ?? 300, {
            leading: true,
            trailing: false,
          });

    render() {
      const { forwardedRef, debounce, ...props } = this.props;
      return (
        <WrappedComponent
          ref={forwardedRef}
          activeOpacity={0.8}
          {...(props as T)}
          onPress={this.onPress}
        />
      );
    }
  }
  return forwardRef<WrappedComponentInstance, T>((props, ref) => (
    <PreventDoubleClick forwardedRef={ref} {...props} />
  ));
}

const Touchable = withPreventDoubleClick(TouchableOpacity);
export const NativeTouchable = withPreventDoubleClick(
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity,
);
export const AnimatedTouchable = Animated.createAnimatedComponent(Touchable);
export const AnimatedNativeTouchable =
  Animated.createAnimatedComponent(NativeTouchable);

export default Touchable;
