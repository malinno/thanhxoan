import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { AnimateProps, FadeInDown } from 'react-native-reanimated';

interface ISectionProps extends AnimateProps<ViewProps> {
  title?: string;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  rightComponent?: JSX.Element;
  bodyComponent?: React.ElementType;
  bodyProp?: ISectionBodyProps;
  children?: React.ReactNode;
}

interface ISectionBodyProps extends ViewProps {
  container?: React.ElementType;
  onPress?: () => void;
  disabled?: boolean;
}

export const SectionBody: React.FunctionComponent<
  ISectionBodyProps
> = props => {
  const Container = props?.container ?? View;
  const { children, style, ...rest } = props;
  return (
    <Container {...rest} style={[styles.content, style]}>
      <LinearGradient
        colors={[colors.colorF9FAFB, colors.colorF9FAFB]}
        style={styles.bodyBackground}
      />
      {children}
    </Container>
  );
};

const Section: React.FunctionComponent<ISectionProps> = props => {
  const {
    title,
    titleContainerStyle,
    titleStyle,
    style,
    rightComponent,
    bodyComponent,
    children,
    bodyProp,
    ...rest
  } = props;

  const Body = bodyComponent || SectionBody;
  return (
    <Animated.View
      style={[styles.section, style]}
      entering={FadeInDown.duration(300)}
      {...rest}>
      {!!title && (
        <View
          style={[
            styles.titleContainer,
            titleContainerStyle,
            !isNil(children) && {
              marginBottom: 16,
            },
          ]}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {rightComponent}
        </View>
      )}
      <Body {...bodyProp}>{children}</Body>
    </Animated.View>
  );
};

export default Section;

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  content: {
    borderWidth: 1,
    borderColor: colors.colorE5E7EB,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bodyBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 8,
  },
});
