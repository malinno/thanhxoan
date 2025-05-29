import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import { UpdatePosOrderStateReasonDto } from '@app/interfaces/dtos/pos-order.dto';
import { CancelReason } from '@app/interfaces/entities/cancel-reason.entity';
import { usePosOrderCancelReasons } from '@app/queries/pos-order.query';
import Button from '@core/components/Button';
import Popup from '@core/components/popup/Popup';
import SelectOption from '@core/components/selectPicker/SelectOption';
import {
  Option,
  SelectOptionRef,
} from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

type TCancelPayload = {
  reason?: CancelReason;
  explain?: string;
};

type Props = {
  onSubmit?: (data?: UpdatePosOrderStateReasonDto) => void;
};

const CancelPosOrderView: FC<Props> = ({ onSubmit }) => {
  const [data, setData] = useState<TCancelPayload>();
  const { data: reasons } = usePosOrderCancelReasons();

  const _selectOptionRef = useRef<SelectOptionRef>(null);

  useEffect(() => {
    if (reasons?.[0] && !data?.reason?.id) {
      setData({ reason: reasons?.[0] });
    }
  }, [reasons]);

  const onChangeText = (explain: string) => {
    setData(preState => ({
      ...preState,
      explain,
    }));
  };

  const onPressReasons = () => {
    if (!reasons) return;
    const options: Option[] = reasons?.map(it => ({
      key: it.id,
      text: it.reason,
    }));
    _selectOptionRef.current?.open({
      title: 'Chọn lý do',
      options,
      onSelected: function (option: Option): void {
        setData(preState => ({
          ...preState,
          reason: {
            id: Number(option.key),
            reason: option.text,
          },
        }));
      },
    });
  };

  const _onPressCancel = () => {
    closePopup();
  };

  const _onPressConfirm = () => {
    closePopup();
    onSubmit?.(
      data
        ? {
            reason_id: data.reason?.id,
            explain_reason: data.explain,
          }
        : undefined,
    );
  };

  const closePopup = () => {
    Popup.hide();
  };

  return (
    <Animated.View style={[styles.container]}>
      <Input
        title="Lý do huỷ đơn"
        rightButtons={[{ icon: images.common.chevronForward }]}
        value={data?.reason?.reason}
        editable={false}
        onPress={onPressReasons}
        style={styles.input}
      />

      <Input
        title="Giải trình lý do huỷ"
        multiline
        numberOfLines={4}
        maxLength={500}
        textAlignVertical="top"
        style={[styles.input]}
        inputStyle={styles.note}
        onChangeText={onChangeText}
      />

      <HStack style={styles.actions}>
        <Button
          text="Đóng"
          colors={colors.colorDADADA}
          textStyle={{ color: colors.black }}
          style={styles.button}
          onPress={_onPressCancel}
        />

        <Button
          text="Xác nhận"
          colors={colors.red}
          onPress={_onPressConfirm}
          style={styles.button}
        />
      </HStack>

      <SelectOption ref={_selectOptionRef} />
    </Animated.View>
  );
};

export default CancelPosOrderView;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 20,
  },
  input: {
    marginTop: 0,
    marginHorizontal: 16,
  },
  note: {
    height: 60,
  },
  actions: {
    gap: 8,
    justifyContent: 'center',
  },
  button: {
    width: 100,
    minHeight: 48,
  },
});
