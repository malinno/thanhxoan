import HStack from '@app/components/HStack';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { TOPIC_NAME, subscribe } from '@core/manager/TimerManager';
import TimeUtils from '@core/utils/TimeUtils';
import { useAppState } from '@react-native-community/hooks';
import React, { FC, useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';

interface Props extends ViewProps {
  icon?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  from?: number;
  to?: number;
}

const CheckInTimer: FC<Props> = ({
  icon,
  iconStyle,
  text,
  textStyle,
  from,
  to,
  style,
  ...props
}) => {
  const appState = useAppState();

  const [duration, setDuration] = useState<any>();

  useEffect(() => {
    const isOnScreen = appState === 'active';
    const isFreeze = Boolean(to);
    if (isFreeze)
      return setDuration(TimeUtils.durationSince(from, to, 'object'));

    const callback = (args: any) => {
      const durationSince = TimeUtils.durationSince(from, to, 'object');
      //   console.log(`durationSince`, durationSince);
      setDuration(durationSince);
      if (!durationSince) unsubscribe?.();
    };

    const unsubscribe =
      from && isOnScreen ? subscribe(TOPIC_NAME.SECOND, callback) : undefined;

    return () => unsubscribe?.();
  }, [appState, from, to]);

  const { hours, minutes, seconds } = duration || {};

  return (
    <HStack style={[styles.section, style]} {...props}>
      {!!icon && <Image source={icon} style={iconStyle} />}
      {!!text && (
        <Text style={[styles.text, textStyle]} numberOfLines={1}>
          {text}
        </Text>
      )}
      <View style={styles.timer}>
        <Text style={styles.timerText}>
          {hours || '00'}:{minutes || '00'}:{seconds || '00'}
        </Text>
      </View>
    </HStack>
  );
};

export default CheckInTimer;

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  text: {
    flex: 1,
    fontWeight: '500',
    color: colors.color161616,
  },
  timer: {
    backgroundColor: colors.colorsFF00001A,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  timerText: {
    color: colors.red,
  },
});
