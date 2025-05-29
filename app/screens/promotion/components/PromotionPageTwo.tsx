import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { colors } from '@core/constants/colors.constant';
import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PromotionProductSection from './PromotionProductSection';

interface Props {
  data?: PromotionProgram;
}

const PromotionPageTwo: FC<Props> = ({ data, ...props }) => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data?.ctkm_sanpham_ids?.map((it, index) => {
          return <PromotionProductSection key={it.id} data={it} />;
        })}
      </ScrollView>
    </View>
  );
};

export default PromotionPageTwo;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
