import { StyleSheet, View } from 'react-native';
import React, { FunctionComponent } from 'react';
import { CustomerCategoryType } from '@app/interfaces/entities/customer-category.type';
import { isArray } from 'lodash';
import { CUSTOMER_CATEGORY_MAPPING } from '@app/constants/customer-categories.constant';
import Text from '@core/components/Text';

interface Props {
  category?: CustomerCategoryType | [CustomerCategoryType, string];
}

const CustomerCategoryView: FunctionComponent<Props> = props => {
  if (!props.category) return null;

  const cateKey = isArray(props.category) ? props.category[0] : props.category;
  const category = CUSTOMER_CATEGORY_MAPPING[cateKey];

  return (
    <View style={[styles.state, { backgroundColor: category.backgroundColor }]}>
      <Text
        style={[styles.stateText, { color: category.textColor }]}
        numberOfLines={1}>
        {category?.displayText}
      </Text>
    </View>
  );
};

export default CustomerCategoryView;

const styles = StyleSheet.create({
  state: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
});
