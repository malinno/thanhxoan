import HStack from '@app/components/HStack';
import { ReturnProductState } from '@app/enums/return-product.enum';
import { FC } from 'react';
import { Text, ViewProps } from 'react-native';

interface Props extends ViewProps {
  state: ReturnProductState;
}

const StateConfig = {
  [ReturnProductState.draft]: {
    title: 'Dự thảo',
    color: '#6B7A90',
    backgroundColor: '#F5F5F5',
  },
  [ReturnProductState.waiting_approve]: {
    title: 'Chờ duyệt',
    color: '#8C6D00',
    backgroundColor: '#FFECA7',
  },
  [ReturnProductState.verified]: {
    title: 'Đã xác thực',
    color: '#FFFFFF',
    backgroundColor: '#8C6D00',
  },
  [ReturnProductState.confirmed]: {
    title: 'Đã xác nhận',
    color: '#fff',
    backgroundColor: '#2ABDA8',
  },
  [ReturnProductState.completed]: {
    title: 'Hoàn thành',
    color: '#fff',
    backgroundColor: '#459407',
  },
  [ReturnProductState.canceled]: {
    title: 'Đã hủy',
    color: '#fff',
    backgroundColor: '#FE6D8A',
  },
};

export const ReturnProductStateComponent: FC<Props> = ({ ...props }) => {
  return (
    <HStack
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: StateConfig?.[props.state]?.backgroundColor || '#fff',
      }}>
      <Text
        style={{
          color: StateConfig?.[props.state]?.color || '#000',
        }}>
        {StateConfig?.[props.state]?.title || props?.state}
      </Text>
    </HStack>
  );
};
