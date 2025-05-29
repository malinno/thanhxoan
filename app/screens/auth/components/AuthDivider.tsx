import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import React, { FunctionComponent } from 'react';
import Text from '@core/components/Text';
import { useTranslation } from 'react-i18next';
import { colors } from '@core/constants/colors.constant';

interface Props extends ViewProps {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  dividerStyle?: StyleProp<ViewStyle>;
}

const AuthDivider: FunctionComponent<Props> = props => {
  const { t } = useTranslation();

  const { text, style, textStyle, dividerStyle, ...rest } = props;

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={[styles.divider, dividerStyle]} />
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <View style={[styles.divider, dividerStyle]} />
    </View>
  );
};

export default AuthDivider;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.colors7A889C,
  },
  text: {
    fontSize: 12,
    color: colors.colors7A889C,
    marginHorizontal: 8,
  },
});
