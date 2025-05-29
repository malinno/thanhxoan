import { StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { PartnerAccountBank } from '@app/interfaces/entities/partner-account-bank.entity';
import { colors } from '@core/constants/colors.constant';
import HStack from '@app/components/HStack';
import SectionRow from '@app/components/SectionRow';
import images from '@images';

type Props = Omit<TouchableProps, 'onPress'> & {
  index: number;
  data: PartnerAccountBank;
  onPress?: (data: PartnerAccountBank) => void;
};

const BankAccountItem: FC<Props> = ({
  index,
  data,
  onPress,
  style,
  ...props
}) => {
  const _onPress = () => onPress?.(data);

  return (
    <Touchable style={[styles.item, style]} onPress={_onPress}>
      <HStack style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {data.account_number}
        </Text>
      </HStack>
      <View style={styles.separator} />
      <View style={styles.body}>
        <SectionRow
          style={styles.row}
          leftIcons={[{ src: images.client.user, style: styles.rowIcon }]}
          title={data.account_owner}
          titleProps={{ style: [styles.rowText, { color: colors.primary }] }}
        />
        <SectionRow
          style={styles.row}
          leftIcons={[{ src: images.client.store, style: styles.rowIcon }]}
          title={data.bank_id?.name}
          titleProps={{ style: styles.rowText }}
        />
        <SectionRow
          style={styles.row}
          leftIcons={[{ src: images.client.location, style: styles.rowIcon }]}
          title={data.bank_branch}
          titleProps={{ style: styles.rowText }}
        />
      </View>
    </Touchable>
  );
};

export default BankAccountItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
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
    gap: 8,
  },
  row: {
    alignItems: 'center',
  },
  rowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginTop: 0,
  },
  rowText: {
    fontSize: 14,
    fontWeight: '400',
  },
});
