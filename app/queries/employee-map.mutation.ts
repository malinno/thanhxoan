import ApiErp from '@app/api/ApiErp';
import {
  CreateEmployeeMapDto,
  UpdateEmployeeMapDto,
} from '@app/interfaces/dtos/employee-map.dto';
import UserRepo from '@app/repository/user/UserRepo';
import { useMutation } from '@tanstack/react-query';

type EditEmployeeMapMutationData = {
  id: number;
  data: UpdateEmployeeMapDto;
};

export const createEmployeeMapMutation = () =>
  useMutation({
    mutationFn: async (data: CreateEmployeeMapDto) => {
      return UserRepo.createEmployeeMap(data);
    },
    onSuccess: ({ response, error }) => {
      if (
        error ||
        response?.error ||
        !response?.result ||
        response.result.message
      ) {
        throw error || response?.error || response?.result;
      }
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });

      console.log(`create employee map record error`, error);
      console.log(`create employee map record error message`, message);
    },
  });

export const editEmployeeMapMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: EditEmployeeMapMutationData) => {
      if (!id) throw new Error(`id cannot be nil`);
      return UserRepo.editEmployeeMap(id, data);
    },
    onSuccess: ({ response, error }) => {
      if (
        error ||
        response?.error ||
        !response?.result ||
        response.result.message
      ) {
        throw error || response?.error || response?.result;
      }
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });

      console.log(`edit employee map record error`, error);
      console.log(`edit employee map record error message`, message);

      // return Alert.alert({
      //   style: { width: 343 },
      //   title: 'Thông báo',
      //   titleContainerStyle: {
      //     borderBottomWidth: 1,
      //     borderColor: colors.colorEFF0F4,
      //     paddingBottom: 12,
      //   },
      //   image: images.common.imgBell,
      //   message,
      //   messageStyle: {
      //     fontSize: 14,
      //     fontWeight: '400',
      //     color: colors.color161616BF,
      //   },
      //   messageContainerStyle: { borderBottomWidth: 0 },
      // });
    },
  });
