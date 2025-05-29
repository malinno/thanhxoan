import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { FC } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  label: string;
  text?: string;
};

const CardText: FC<Props> = ({ label, text }) => {
  return (
    <Text style={styles.cardText}>
      <Text style={[styles.cardText, { fontWeight: '700' }]}>{label}</Text>{' '}
      {text}
    </Text>
  );
};

export default CardText

const styles = StyleSheet.create({
  cardText: {
    fontSize: 12,
    color: colors.white,
    marginTop: 8,
  },
});
