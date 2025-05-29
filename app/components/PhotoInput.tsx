import { SCREEN } from '@app/enums/screen.enum';
import Text, { AnimatedText } from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import AddPhotoButton from './AddPhotoButton';
import Touchable from '@core/components/Touchable';
import images from '@images';
import { isEmpty, isNil } from 'lodash';
import HStack from './HStack';

interface Props extends ViewProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  required?: boolean;
  titleRightComponent?: JSX.Element;
  error?: string | JSX.Element;
  editable?: boolean;
  onPressAdd?: () => void;
  onPressRemoveItem?: (item: string) => void;
  onPressItem?: (item: string, index: number) => void;
  values?: string[];
  onChange?: (values: string[]) => void;
  renderValues?: (values: string[]) => React.ReactNode;
  multiple?: boolean;
  removableUploaded?: boolean;
}

const PhotoInput: FC<Props> = ({
  title,
  titleStyle,
  required,
  titleRightComponent,
  error,
  editable,
  onPressAdd,
  onPressRemoveItem,
  onPressItem,
  onChange,
  renderValues,
  style,
  multiple = true,
  removableUploaded = true,
  ...props
}) => {
  const navigation = useNavigation();
  const [values, setValues] = useState<string[]>(props.values || []);

  useEffect(() => {
    setValues(props.values || []);
  }, [props.values]);

  const onPress = () => {
    if (onPressAdd) {
      onPressAdd();
      return;
    }
    navigation.navigate(SCREEN.CAMERA, {
      onCaptured: (path: string) => {
        const newValues = [
          ...values,
          Platform.select({
            ios: path,
            default: `file://${path}`,
          }),
        ];
        setValues(newValues);
        onChange?.(newValues);
      },
    });
  };

  const _renderValues = () => {
    if (isNil(renderValues)) {
      return values?.map((value, index) => {
        const _onPress = () => onPressItem?.(value, index);

        const _onPressRemove = () => {
          if (onPressRemoveItem) {
            onPressRemoveItem(value);
            return;
          }
          const newValues = [...values.filter(v => v !== value)];
          setValues(newValues);
          onChange?.(newValues);
        };

        return (
          <Touchable
            key={String(index)}
            activeOpacity={1}
            onPress={_onPress}
            style={[styles.imgContainer, { marginRight: 12 }]}>
            <Image
              source={{ uri: Boolean(value) ? value : undefined }}
              style={styles.img}
              resizeMode="cover"
            />
            {editable && (removableUploaded === true || !value.startsWith('http')) && (
              <Touchable
                activeOpacity={1}
                style={styles.removeBtn}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={_onPressRemove}>
                <Image
                  source={images.common.close}
                  style={styles.removeIcon}
                  resizeMode="contain"
                />
              </Touchable>
            )}
          </Touchable>
        );
      });
    }

    return renderValues(values);
  };

  return (
    <View style={[styles.container, style]}>
      {Boolean(title) && (
        <HStack style={{ gap: 12 }}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {Boolean(required) && <Text style={styles.required}>* </Text>}
            {title}
          </Text>
          {titleRightComponent}
        </HStack>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.input}
        bounces={false}>
        {_renderValues()}
        {editable && (multiple || values.length < 1) && (
          <AddPhotoButton onPress={onPress} />
        )}
      </ScrollView>
      {!!error && (
        <AnimatedText
          style={styles.errorText}
          entering={FadeIn}
          exiting={FadeOut}>
          {error}
        </AnimatedText>
      )}
    </View>
  );
};

PhotoInput.defaultProps = {
  editable: true,
};

export default PhotoInput;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  required: {
    color: colors.colorFB4646,
  },
  imgContainer: {},
  img: {
    width: 98,
    height: 98,
    borderRadius: 4,
  },
  title: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: colors.color6B7A90,
  },
  input: {
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.colorFB4646,
  },
  removeBtn: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.red,
    position: 'absolute',
    top: -8,
    right: -8,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    flex: 1,
  },
});
