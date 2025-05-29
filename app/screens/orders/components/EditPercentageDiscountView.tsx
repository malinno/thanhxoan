import HStack from '@app/components/HStack';
import QuantityAdjustment, {
  QtyAdjustmentRef,
} from '@app/components/QuantityAdjustment';
import Button from '@core/components/Button';
import Popup from '@core/components/popup/Popup';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet } from 'react-native';
import { FadeInDown, FadeOutDown } from 'react-native-reanimated';

export type TPercentageDiscountPayload = {
  discount: number;
};

type Props = {
  discount?: number;
  onSubmit?: (data: TPercentageDiscountPayload) => void;
};

const EditPercentageDiscountView: FC<Props> = ({ onSubmit, ...props }) => {
  const [discount, setDiscount] = useState(props.discount || 0);

  const _discountRef = useRef<QtyAdjustmentRef>(null);

  const onChangeDiscount = (discount: string) => {
    setDiscount(Number(discount));
  };

  const _onPressCancel = () => {
    closePopup();
  };

  const _onPressConfirm = () => {
    closePopup();
    onSubmit?.({
      discount: Number(_discountRef.current?.getValue() || discount),
    });
  };

  const closePopup = () => {
    Popup.hide();
  };

  return (
    <Pressable style={[styles.container]} onPress={Keyboard.dismiss}>
      <HStack style={styles.row}>
        <Text style={styles.label}>Chiết khấu (%)</Text>
        <QuantityAdjustment
          ref={_discountRef}
          max={100}
          value={String(discount)}
          onChangeText={onChangeDiscount}
        />
      </HStack>

      <HStack
        style={styles.actions}
        entering={FadeInDown}
        exiting={FadeOutDown}>
        <Button
          text="Đóng"
          colors={colors.colorDADADA}
          textStyle={{ color: colors.black }}
          style={styles.button}
          onPress={_onPressCancel}
        />

        <Button
          text="Xác nhận"
          colors={colors.primary}
          onPress={_onPressConfirm}
          style={styles.button}
        />
      </HStack>
    </Pressable>
  );
};

export default EditPercentageDiscountView;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {},
  row: {
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    pointerEvents: 'none',
  },
  actions: {
    gap: 8,
    justifyContent: 'center',
  },
  button: {
    width: 100,
    minHeight: 48,
  },
  unitInput: {
    minWidth: 150,
  },
});
