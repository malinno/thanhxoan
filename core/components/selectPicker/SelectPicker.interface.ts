import React from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type SelectOptionRef = {
  open(params: SelectOptionParams): void;
  close(): void;
};

export interface Option {
  key: string | number;
  leftIcon?: ImageSourcePropType;
  leftIconStyle?: StyleProp<ImageStyle>;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  text: string;
}

export interface SelectOptionParams {
  title?: string;
  options: Option[];
  data?: any;
  onSelected: (option: Option, data?: any) => void;
  renderEmpty?: React.ReactNode;
  containerComponent?: React.ElementType;
  containerStyle?: StyleProp<ViewStyle>;
}
