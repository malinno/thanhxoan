import HStack from '@app/components/HStack';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import PriceUtils from '@core/utils/PriceUtils';
import images from '@images';
import dayjs from 'dayjs';
import { identity, isNil } from 'lodash';
import React, { FC, memo, useMemo } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

export type TPromotionPickerItem = PromotionProgram & {
  isSelected?: boolean;
};

interface Props extends ViewProps {
  index?: number;
  data: TPromotionPickerItem;
  onPress?: (data: TPromotionPickerItem) => void;
}

const PromotionPickerItem: FC<Props> = memo(props => {
  const { data, onPress, style } = props;
  const isSelected = data.isSelected;

  const _onPress = () => onPress?.(data);

  const description = useMemo(() => {
    let descSentences = [];
    if (data.chietkhauphantram) {
      descSentences.push(`Giảm ${data.chietkhauphantram}%`);
      if (data.max_promotion_value) {
        descSentences[0] += ` tối đa ${PriceUtils.format(
          data.max_promotion_value,
        )}`;
      }
    }
    if (data.chietkhaucodinh) {
      descSentences.push(`Giảm ${PriceUtils.format(data.chietkhaucodinh)}`);
    }
    if (data.ctkm_sanpham_ids)
      descSentences.push(
        `Áp dụng trên một số mặt hàng: ${data.ctkm_sanpham_ids
          .map(it => it.product_id.name)
          .filter(identity)
          .join(',')}`,
      );
    if (data.gia_tri_toi_thieu_don_hang) {
      descSentences.push(
        `Áp dụng cho đơn hàng từ ${PriceUtils.format(
          data.gia_tri_toi_thieu_don_hang,
        )}`,
      );
    }
    return descSentences.join('. ');
  }, [data.chietkhauphantram, data.ctkm_sanpham_ids]);

  const beginAt = data.ngay_bat_dau
    ? dayjs(data.ngay_bat_dau, 'YYYY-MM-DD')
    : undefined;
  const endAt = data.ngay_ket_thuc
    ? dayjs(data.ngay_ket_thuc, 'YYYY-MM-DD')
    : undefined;

  return (
    <Touchable onPress={_onPress} style={[styles.item, style]}>
      <View
        style={[
          styles.circle,
          isSelected && { backgroundColor: colors.primary },
        ]}>
        <Image
          style={styles.checkIcon}
          source={images.common.check}
          resizeMode="contain"
        />
      </View>

      <HStack style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>
          [{data.code}] {data.name}
        </Text>
      </HStack>
      <View style={styles.separator} />

      <View style={styles.body}>
        <Text style={styles.description}>{description}</Text>
        {(!isNil(beginAt) || !isNil(endAt)) && (
          <HStack style={styles.dateContainer}>
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>Ngày bắt đầu</Text>
              <Text style={styles.dateValue}>
                {beginAt ? beginAt.format('DD/MM/YYYY') : ''}
              </Text>
            </View>
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>Ngày kết thúc đầu</Text>
              <Text style={styles.dateValue}>
                {endAt ? endAt.format('DD/MM/YYYY') : ''}
              </Text>
            </View>
          </HStack>
        )}
      </View>
    </Touchable>
  );
});

export default PromotionPickerItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorE3E5E8,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  name: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingVertical: 16,
  },
  description: {},
  dateContainer: {
    gap: 8,
    marginTop: 8,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.color22222226,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [
      {
        translateX: 10,
      },
      {
        translateY: 10,
      },
    ],
  },
  checkIcon: {
    transform: [
      {
        translateX: -4,
      },
      {
        translateY: -4,
      },
    ],
  },
});
