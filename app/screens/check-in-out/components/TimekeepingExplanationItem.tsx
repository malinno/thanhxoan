import HStack from '@app/components/HStack';
import { TIMEKEEPING_EXPLANATION_STATE_MAPPING } from '@app/constants/timekeeping-explanation.constant';
import { TimekeepingExplanation } from '@app/interfaces/entities/timekeeping-explanation.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { isNil } from 'lodash';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: TimekeepingExplanation;
  onPress?: (data: TimekeepingExplanation) => void;
}

const TimekeepingExplanationItem: FC<Props> = memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const status = TIMEKEEPING_EXPLANATION_STATE_MAPPING[data.state];

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {/* {data.name} */}
          </Text>
          {!isNil(status) && (
            <View
              style={[
                styles.state,
                { backgroundColor: status.backgroundColor },
              ]}>
              <Text
                style={[styles.stateText, { color: status.textColor }]}
                numberOfLines={1}>
                {status?.displayText}
              </Text>
            </View>
          )}
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.common.userCircle} />
            <Text
              style={[
                styles.text,
                { fontWeight: '700', color: colors.primary },
              ]}
              numberOfLines={1}>
              {data.employee_id?.name}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.index} />
            <Text style={[styles.text]} numberOfLines={1}>
              Chức vụ: {data.job_id?.name}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.index} />
            <Text style={[styles.text]} numberOfLines={1}>
              Phòng ban: {data.department_id?.name}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.index} />
            <Text style={[styles.text]} numberOfLines={1}>
              Công ty: {data.cmp_group_id?.name}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default TimekeepingExplanationItem;

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
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingVertical: 16,
    gap: 8,
  },
  row: {
    alignItems: 'flex-start',
  },
  icon: {
    marginTop: 2,
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
});
