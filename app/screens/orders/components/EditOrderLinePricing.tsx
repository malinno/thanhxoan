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

export type TOrderLinePricingPayload = {
  unit_price: number;
  discount: number;
};

type Props = {
  unit_price?: number;
  discount?: number;
  onSubmit?: (data: TOrderLinePricingPayload) => void;
};

const EditOrderLinePricing: FC<Props> = ({ onSubmit, ...props }) => {
  const [unitPrice, setUnitPrice] = useState(props.unit_price || 0);
  const [discount, setDiscount] = useState(props.discount || 0);

  const _unitPriceRef = useRef<QtyAdjustmentRef>(null);
  const _discountRef = useRef<QtyAdjustmentRef>(null);

  const onChangeUnitPrice = (text: string) => {
    setUnitPrice(Number(text));
  };

  const onChangeDiscount = (discount: string) => {
    setDiscount(Number(discount));
  };

  const _onPressCancel = () => {
    closePopup();
  };

  const _onPressConfirm = () => {
    closePopup();
    onSubmit?.({
      unit_price: Number(_unitPriceRef.current?.getValue() || unitPrice),
      discount: Number(_discountRef.current?.getValue() || discount),
    });
  };

  const closePopup = () => {
    Popup.hide();
  };

  return (
    <Pressable style={[styles.container]} onPress={Keyboard.dismiss}>
      <HStack style={styles.row}>
        <Text style={styles.label}>Đơn giá</Text>
        <QuantityAdjustment
          ref={_unitPriceRef}
          value={String(unitPrice)}
          inputContainerStyle={styles.unitInput}
          onChangeText={onChangeUnitPrice}
        />
      </HStack>
      <HStack style={styles.row}>
        <Text style={styles.label}>Giảm giá (%)</Text>
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

export default EditOrderLinePricing;

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
