import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import PromotionComboPickerLine from './PromotionComboPickerLine';
import { ProductGift } from '@app/interfaces/entities/product-gift.entity';
import {
  TComboGiftLine,
  usePromotionGiftPickerForm,
} from '@app/hooks/usePromotionGiftPickerForm';
import { isEmpty } from 'lodash';
import ListEmpty from '@app/components/ListEmpty';

interface Props extends SceneRendererProps {
  route: Route;
  productGift?: ProductGift;
}

const PromotionComboPickerScene: FC<Props> = ({ productGift, ...props }) => {
  const data = usePromotionGiftPickerForm(state => state.data);
  const setData = usePromotionGiftPickerForm(state => state.setData);

  const onPressItem = (item: TComboGiftLine, index: number) => {
    const newComboGifts = [...data.combo_gifts];
    newComboGifts[index].selected = !item.selected;
    setData({ combo_gifts: newComboGifts });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      bottomOffset={50}>
      <Text style={styles.notice}>Chọn các quà tặng áp dụng</Text>

      {!isEmpty(data?.combo_gifts) ? (
        data?.combo_gifts?.map((line, lineIndex) => (
          <PromotionComboPickerLine
            key={line.id}
            data={line}
            index={lineIndex}
            onPress={onPressItem}
          />
        ))
      ) : (
        <ListEmpty text="Danh sách quà hiện đang trống" />
      )}
    </KeyboardAwareScrollView>
  );
};

export default PromotionComboPickerScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  notice: {
    color: colors.red,
    fontWeight: '600',
    textAlign: 'center',
  },
});
