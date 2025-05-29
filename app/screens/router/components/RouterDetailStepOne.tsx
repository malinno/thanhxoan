import Input from '@app/components/Input';
import RadioButtonGroup from '@app/components/RadioButtonGroup';
import Section from '@app/components/Section';
import { DAYS_OF_WEEK } from '@app/constants/app.constant';
import { ErpRouter } from '@app/interfaces/entities/erp-router.entity';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC, Fragment } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface Props {
  data?: ErpRouter;
}

const RouterDetailStepOne: FC<Props> = ({ data, ...props }) => {
  const { width } = useWindowDimensions();

  const routeName = data?.name;

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section title="Thông tin tuyến bán hàng" bodyComponent={Fragment}>
          <Input
            style={[styles.input, { marginTop: 0 }]}
            title="Tên kế hoạch"
            value={routeName}
          />

          <RadioButtonGroup
            horizontal
            style={{ marginTop: 16 }}
            value={data?.day_of_week ? Number(data?.day_of_week) : undefined}
            data={DAYS_OF_WEEK}
            itemOuterStyle={{
              flexDirection: 'column',
              width: (width - 32) / DAYS_OF_WEEK.length,
            }}
            itemGap={0}
            editable={false}
          />

          <Input
            style={styles.input}
            title="Nhân viên phụ trách"
            // rightButtons={[{ icon: images.common.chevronForward }]}
            value={data?.salesperson_id?.[1] || ''}
            editable={false}
          />

          <Input
            style={styles.input}
            title="Đội ngũ bán hàng"
            // rightButtons={[{ icon: images.common.chevronForward }]}
            disabled
            value={data?.team_id?.[1] || ''}
          />

          <Input
            style={styles.input}
            title="Công ty con"
            // rightButtons={[{ icon: images.common.chevronForward }]}
            disabled
            value={data?.cmp_id?.[1] || ''}
          />
        </Section>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RouterDetailStepOne;

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
    paddingBottom: 16,
  },
  input: {
    // marginHorizontal: 16,
  },
});
