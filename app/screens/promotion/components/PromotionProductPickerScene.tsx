import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import PromotionProductPickerLine from './PromotionProductPickerLine';
import { ProductGift } from '@app/interfaces/entities/product-gift.entity';
import { usePromotionGiftPickerForm } from '@app/hooks/usePromotionGiftPickerForm';
import ListEmpty from '@app/components/ListEmpty';
import { isEmpty } from 'lodash';

interface Props extends SceneRendererProps {
  route: Route;
  productGift?: ProductGift;
}

const PromotionProductPickerScene: FC<Props> = ({
  route,
  productGift,
  ...props
}) => {
  const data = usePromotionGiftPickerForm(state => state.data);
  const setData = usePromotionGiftPickerForm(state => state.setData);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      bottomOffset={50}>
      <Text style={styles.notice}>
        Chọn quà khuyến mại theo từng sản phẩm mua
      </Text>

      {!isEmpty(data?.options_combo_gifts) ? (
        data?.options_combo_gifts?.map((line, lineIndex) => (
          <PromotionProductPickerLine
            key={line.applyProduct.id}
            line={line}
            index={lineIndex}
          />
        ))
      ) : (
        <ListEmpty text="Danh sách quà hiện đang trống" />
      )}
    </KeyboardAwareScrollView>
  );
};

export default PromotionProductPickerScene;

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
