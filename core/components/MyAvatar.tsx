import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React, { FC, useEffect, useMemo } from 'react';
import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import FastImage, { Source as FastImageSource } from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export const abbr = (name: string, maxChars: number = 2) => {
  if (!name) {
    console.warn('Could not get abbr from name');
    return name;
  }
  const words = name.split(' ');
  let initials = '';
  for (let i = 0; i < Math.min(words.length, maxChars); i++) {
    if (words.length === 1) {
      initials += words[i].slice(0, Math.min(words[i].length, maxChars));
    } else {
      initials += words[i].charAt(0);
    }
  }

  return initials.toUpperCase();
};

const MIN_BADGE_SIZE = 10;
const MAX_BADGE_SIZE = 45;

export enum BadgePositions {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export interface BadgeProps extends ViewProps {
  size?: number;
  color?: string;
  radius?: number;
  animate?: boolean;
  value?: number | string | boolean;
  limit?: number;
  parentRadius?: number;
  position?: `${BadgePositions}`;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

interface TextAvatarProps {
  name?: string;
  size?: number;
  textColor?: string;
  textStyle?: StyleProp<TextStyle>;
}

interface MyAvatarProps extends TextAvatarProps {
  bgColors?: string[];
  src?: FastImageSource;
  style?: StyleProp<ViewStyle>;
  badge?: BadgeProps['value'];
  badgeColor?: BadgeProps['color'];
  badgeProps?: Omit<BadgeProps, 'value' | 'color' | 'parentRadius'>;
}

const AvatarBadge: FC<BadgeProps> = ({
  size = 10,
  color = colors.colorFF3B30,
  radius,
  value,
  limit = 99,
  parentRadius = 0,
  position,
  style,
  textStyle,
  ...props
}) => {
  const hasContent = typeof value === 'number' || typeof value === 'string';
  const minHeight = Math.max(MIN_BADGE_SIZE, Math.min(size, MAX_BADGE_SIZE));
  const height = hasContent
    ? Math.max(MIN_BADGE_SIZE, Math.min(size, MAX_BADGE_SIZE))
    : minHeight;

  const offset = useMemo(() => {
    const edgeOffset = parentRadius * (1 - Math.sin((45 * Math.PI) / 180));
    const selfOffset =
      (1 + Math.max(0, Math.min(parentRadius / height, 1))) * (height / 4);

    return PixelRatio.roundToNearestPixel(edgeOffset - selfOffset);
  }, [height, parentRadius]);

  if (!value) return null;

  let content = null;

  if (hasContent) {
    const fontSize = PixelRatio.roundToNearestPixel(height * 0.6);
    const textStyles = {
      ...badgeStyles.text,
      fontSize,
      marginHorizontal: fontSize / 2,
    };

    content = (
      <Text style={[textStyles, textStyle]} numberOfLines={1}>
        {typeof value === 'number' && limit > 0 && value > limit
          ? `${limit}+`
          : value}
      </Text>
    );
  }

  const rootStyles: StyleProp<ViewStyle> = [
    {
      ...badgeStyles.root,
      height,
      minWidth: height,
      backgroundColor: color,
      borderRadius: radius ?? height / 2,
    },
  ];

  if (position) {
    const [badgeY, badgeX] = position.split('-');
    rootStyles.push({
      ...badgeStyles.position,
      [badgeY]: offset,
      [badgeX]: offset,
    });
  }

  return (
    <Animated.View {...props} style={[rootStyles, style]}>
      {content}
    </Animated.View>
  );
};

const TextAvatar: FC<TextAvatarProps> = ({
  name,
  size,
  textColor,
  textStyle,
}) => {
  if (!name) return null;
  return (
    <Text
      style={[
        {
          color: textColor,
          fontSize: size! / 2.5,
        },
        textStyle,
      ]}
      adjustsFontSizeToFit={true}>
      {abbr(name)}
    </Text>
  );
};

const MyAvatar: FC<MyAvatarProps> = ({
  src,
  size,
  style,
  bgColors,
  badge,
  badgeProps,
  badgeColor,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          height: size,
          width: size,
          borderRadius: size! / 2,
        },
        style,
      ]}>
      {!isNil(src?.uri) ? (
        <FastImage
          source={src}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <TextAvatar size={size} {...props} />
      )}
      {badge !== undefined && (
        <AvatarBadge
          {...badgeProps}
          value={badge}
          color={badgeColor}
          parentRadius={size! / 2}
        />
      )}
    </View>
  );
};

AvatarBadge.defaultProps = {
  position: BadgePositions.BOTTOM_RIGHT,
};

MyAvatar.defaultProps = {
  size: 40,
  textColor: colors.white,
};

export default MyAvatar;

const styles = StyleSheet.create({
  container: {
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorF0F3F4,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
  },
});

const badgeStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  position: {
    zIndex: 1,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    color: '#fff',
    fontWeight: '400',
    fontFamily: 'System',
    includeFontPadding: false,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
});
