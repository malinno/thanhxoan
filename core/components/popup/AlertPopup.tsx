import React, { FC, FunctionComponent } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Popup from './Popup';
import { colors } from '@core/constants/colors.constant';
import Touchable from '@core/components/Touchable';
import { isArray, isNil } from 'lodash';
import Text, { AnimatedText } from '@core/components/Text';
import images from '@images';
import { FadeIn } from 'react-native-reanimated';

export interface AlertProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  image?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  message?: React.ReactNode;
  messageStyle?: StyleProp<ViewStyle | TextStyle>;
  messageContainerStyle?: StyleProp<ViewStyle>;
  actions?: AlertActionButton[];
  renderActions?: (actions: AlertActionButton[]) => React.ReactElement | null;
  renderUpper?: React.ReactNode;
  titleComponent?: React.ReactNode;
}

export enum ALERT_BUTTON_TYPE {
  NORMAL = 'normal',
  CANCEL = 'cancel',
}

export interface AlertActionButton {
  text?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  dismissOnPress?: boolean;
  type?: ALERT_BUTTON_TYPE;
}

const AlertPopup: FC<AlertProps> = props => {
  const {
    title,
    titleStyle,
    titleContainerStyle,
    titleComponent,
    style,
    image,
    imageStyle,
    message,
    messageStyle,
    messageContainerStyle,
    actions,
    renderActions,
    renderUpper,
  } = props;

  const _renderTitle = () => {
    if (isNil(titleComponent))
      return (
        <View style={[styles.titleContainer, titleContainerStyle]}>
          <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        </View>
      );
    return titleComponent;
  };

  const _renderActions = () => {
    if (!actions) return;

    if (renderActions) {
      return renderActions(actions);
    }
    return (
      <View style={styles.actions}>
        {actions?.map((item, index) => {
          const { style, type, textStyle, dismissOnPress = true } = item;
          const _onPress = () => {
            if (dismissOnPress) {
              Popup.hide();
              setTimeout(() => item.onPress && item.onPress(), 500);
              return;
            }
            item.onPress?.();
          };
          return (
            <Touchable
              key={index}
              onPress={_onPress}
              style={[
                styles.action,
                style,
                index !== actions.length - 1 && styles.actionBorder,
              ]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.actionText,
                  type === ALERT_BUTTON_TYPE.CANCEL && styles.cancelText,
                  textStyle,
                ]}>
                {item?.text}
              </Text>
            </Touchable>
          );
        })}
      </View>
    );
  };

  return (
    <>
      {renderUpper}
      <View style={[styles.alert, style]}>
        {/* Render header title */}
        {_renderTitle()}
        {!!image && <Image style={[styles.image, imageStyle]} source={image} />}
        {!isNil(message) && (
          <View style={[styles.messageContainer, messageContainerStyle]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {typeof message === 'string' ? (
                <Text style={[styles.message, messageStyle]}>{message}</Text>
              ) : isArray(message) &&
                message.every(m => typeof m === 'string') ? (
                message.map((m, idx) => (
                  <Text key={idx} style={[styles.message, messageStyle]}>
                    {m}
                  </Text>
                ))
              ) : (
                message
              )}
            </ScrollView>
          </View>
        )}
        {_renderActions()}
      </View>
    </>
  );
};

AlertPopup.defaultProps = {
  actions: [{ text: 'Đóng' }],
};

const styles = StyleSheet.create({
  alert: {
    width: 294,
    backgroundColor: colors.white,
    borderRadius: 6,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    color: colors.black,
  },
  messageContainer: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 18,
    maxHeight: 200,
    borderBottomWidth: 0.5,
    borderColor: colors.colorE0E0E0,
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionBorder: {
    borderRightWidth: 0.5,
    borderColor: colors.colorE0E0E0,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 22,
    textAlign: 'center',
  },
  cancelText: {
    color: colors.color777878,
  },
  image: {
    alignSelf: 'center',
    marginTop: 24,
  },
});

export default AlertPopup;
