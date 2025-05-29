import { ScrollView, StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import { colors } from '@core/constants/colors.constant';
import Text from '@core/components/Text';
import SectionRow from '@app/components/SectionRow';
import DashedLine from '@app/components/DashedLine';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { CUSTOMER_CATEGORY_MAPPING } from '@app/constants/customer-categories.constant';
import dayjs from 'dayjs';
import SwitchToggle from 'react-native-switch-toggle';
import PriceUtils from '@core/utils/PriceUtils';

interface Props {
  data?: PromotionProgram;
}

const PromotionPageOne: FC<Props> = ({ data, ...props }) => {
  const beginAt = data?.ngay_bat_dau
    ? dayjs(data.ngay_bat_dau, 'YYYY-MM-DD')
    : undefined;
  const endAt = data?.ngay_ket_thuc
    ? dayjs(data.ngay_ket_thuc, 'YYYY-MM-DD')
    : undefined;

  const category = data?.category
    ? CUSTOMER_CATEGORY_MAPPING[data?.category]
    : undefined;
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.code}>{data?.code}</Text>
            <Text style={styles.name}>{data?.name}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.section}>
            <SectionRow
              style={[styles.row, { marginTop: 0 }]}
              title="Phân loại"
              text={category ? category?.name : ''}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
            <SectionRow
              style={styles.row}
              title="Phân cấp đối tượng"
              // text={data?.contact_level}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
          </View>

          <DashedLine color={''} children={undefined} />

          <View style={styles.section}>
            <SectionRow
              style={[styles.row, { marginTop: 0 }]}
              title="Ngày bắt đầu"
              text={beginAt ? beginAt.format('DD/MM/YYYY') : ''}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
            <SectionRow
              style={styles.row}
              title="Ngày kết thúc"
              text={endAt ? endAt.format('DD/MM/YYYY') : ''}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
            <SectionRow
              style={styles.row}
              title="Có hiệu lực"
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
              renderText={_ => (
                <SwitchToggle
                  leftContainerStyle={{
                    position: 'absolute',
                    left: 10,
                  }}
                  switchOn={data?.active ?? true}
                  circleStyle={{
                    width: 15,
                    height: 15,
                    borderRadius: 8,
                    backgroundColor: colors.white,
                  }}
                  containerStyle={{
                    width: 46,
                    height: 19,
                    borderRadius: 18,
                    padding: 2,
                  }}
                  backgroundColorOn={colors.primary}
                  circleColorOff={colors.white}
                />
              )}
            />
          </View>

          <DashedLine />

          <View style={styles.section}>
            <SectionRow
              style={[styles.row, { marginTop: 0 }]}
              title="Giá trị tối thiểu"
              text={PriceUtils.format(data?.gia_tri_toi_thieu_don_hang)}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
            <SectionRow
              style={styles.row}
              title="Chiết khấu"
              text={
                data?.chietkhauphantram
                  ? [
                      PriceUtils.format(data?.chietkhauphantram, '%', ''),
                      PriceUtils.format(
                        data?.max_promotion_value,
                        undefined,
                        '',
                      ),
                    ].join(' - ')
                  : ''
              }
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
            <SectionRow
              style={styles.row}
              title="Chương trình"
              text={data?.product_promotion_percent_id?.name}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
          </View>

          <DashedLine color={''} children={undefined} />

          <View style={styles.section}>
            <SectionRow
              style={[styles.row, { marginTop: 0 }]}
              title="Số lần áp dụng/ Khách hàng"
              text={data?.soluotapdungkh || ''}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
            <SectionRow
              style={styles.row}
              title="Số lần áp dụng/ chương trình"
              text={data?.soluotapdungchuongtrinh || ''}
              titleProps={{ style: styles.rowTitle }}
              textProps={{ style: styles.rowText }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PromotionPageOne;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  content: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  code: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color2651E5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  section: {
    paddingVertical: 16,
  },
  row: {
    marginTop: 8,
  },
  rowTitle: {
    fontWeight: '400',
  },
  rowText: {
    fontWeight: '600',
  },
});
