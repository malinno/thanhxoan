import DashedLine from '@app/components/DashedLine';
import SectionRow from '@app/components/SectionRow';
import { PromotionProduct } from '@app/interfaces/entities/promotion-product.entity';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  data: PromotionProduct
}

const PromotionProductSection: FC<Props> = ({data, ...props}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.color2651E51A }]}>
        <SectionRow
          style={styles.row}
          title="Sản phẩm áp dụng"
          text={data.product_id?.default_code}
          titleProps={{ style: styles.title }}
          textProps={{ style: [styles.text, { color: colors.color6B7A90 }] }}
        />
        <SectionRow
          style={styles.row}
          title={data.product_id?.name}
          titleProps={{ style: styles.product }}
        />
        <SectionRow
          style={styles.row}
          title="Số lượng"
          text={data.product_apply_quantity}
          titleProps={{ style: styles.text }}
          textProps={{ style: styles.text }}
        />
      </View>
      <View style={[styles.line]}>
        <SectionRow
          style={styles.row}
          title="Sản phẩm tặng"
          text={data.product_donate_id?.default_code}
          titleProps={{ style: styles.title }}
          textProps={{ style: [styles.text, { color: colors.color6B7A90 }] }}
        />
        <SectionRow
          style={styles.row}
          title={data.product_donate_id?.name}
          titleProps={{ style: styles.text }}
        />
        <SectionRow
          style={styles.row}
          title="Số lượng"
          text={data.product_donate_quantity}
          titleProps={{ style: styles.text }}
          textProps={{ style: styles.text }}
        />
      </View>

      <DashedLine style={{ marginHorizontal: 16, marginVertical: 0 }} />

      <View style={[styles.line]}>
        <SectionRow
          style={styles.row}
          title="Tặng kèm phụ"
          text={data.product_free_id?.default_code}
          titleProps={{ style: styles.title }}
          textProps={{ style: [styles.text, { color: colors.color6B7A90 }] }}
        />
        <SectionRow
          style={styles.row}
          title={data.product_free_id?.name}
          titleProps={{ style: styles.text }}
        />
        <SectionRow
          style={styles.row}
          title="Số lượng"
          text={data.product_free_quantity}
          titleProps={{ style: styles.text }}
          textProps={{ style: styles.text }}
        />
      </View>
    </View>
  );
};

export default PromotionProductSection;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  line: {
    padding: 16,
  },
  row: {
    marginTop: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
  },
  product: {
    color: colors.color2651E5,
  },
});
