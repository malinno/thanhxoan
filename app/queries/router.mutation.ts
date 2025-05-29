import ApiErp from '@app/api/ApiErp';
import {
  CreateRouterDto,
  UpdateRouterDto,
} from '@app/interfaces/dtos/router.dto';
import RouterRepo from '@app/repository/route/RouteRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'App';

type EditRouterMutationData = {
  id?: number | string;
  data: UpdateRouterDto;
};

export const createRouterMutation = () =>
  useMutation({
    mutationFn: async (data: CreateRouterDto) => {
      return RouterRepo.create(data);
    },
    onSuccess: ({ response, headers, error }) => {
      if (
        error ||
        response?.error ||
        !response?.result ||
        response.result.message
      ) {
        throw error || response?.error || response?.result;
      }

      queryClient.refetchQueries({ queryKey: ['infinite-routers-list'] });
      queryClient.refetchQueries({ queryKey: ['route-routers-list'] });
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });

      return Alert.alert({
        style: { width: 343 },
        title: 'Thông báo',
        titleContainerStyle: {
          borderBottomWidth: 1,
          borderColor: colors.colorEFF0F4,
          paddingBottom: 12,
        },
        image: images.common.imgBell,
        message,
        messageStyle: {
          fontSize: 14,
          fontWeight: '400',
          color: colors.color161616BF,
        },
        messageContainerStyle: { borderBottomWidth: 0 },
      });
    },
  });

export const editRouterMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: EditRouterMutationData) => {
      if (!id) throw new Error(`router id cannot be nil`);

      return RouterRepo.update(id, data);
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

      queryClient.refetchQueries({ queryKey: ['infinite-routers-list'] });
      queryClient.refetchQueries({ queryKey: ['route-routers-list'] });
      queryClient.refetchQueries({ queryKey: ['router-detail'] });
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });

      return Alert.alert({
        style: { width: 343 },
        title: 'Thông báo',
        titleContainerStyle: {
          borderBottomWidth: 1,
          borderColor: colors.colorEFF0F4,
          paddingBottom: 12,
        },
        image: images.common.imgBell,
        message,
        messageStyle: {
          fontSize: 14,
          fontWeight: '400',
          color: colors.color161616BF,
        },
        messageContainerStyle: { borderBottomWidth: 0 },
      });
    },
  });
