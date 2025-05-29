import ApiErp from '@app/api/ApiErp';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '@app/interfaces/dtos/customer.dto';
import CustomerRepo from '@app/repository/customer/CustomerRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import UploadUtils from '@core/utils/UploadUtils';
import images from '@images';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'App';
import { isNil } from 'lodash';

type UpdateCustomerMutationData = {
  id?: number | string;
  data: UpdateCustomerDto;
};

export const updateCustomerMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: UpdateCustomerMutationData) => {
      if (!id) throw new Error(`customer id cannot be nil`);
      if (
        !isNil(data.app_image_url) &&
        Boolean(data.app_image_url) &&
        !data.app_image_url?.startsWith('http')
      ) {
        const res = await UploadUtils.uploadImage(
          { path: data.app_image_url },
          { maxSize: 1e6 },
        );
        data.app_image_url = res;
      }
      return CustomerRepo.update(id, data);
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

export const createCustomerMutation = () =>
  useMutation({
    mutationFn: async (data: CreateCustomerDto) => {
      if (
        !isNil(data.app_image_url) &&
        Boolean(data.app_image_url) &&
        !data.app_image_url?.startsWith('http')
      ) {
        const res = await UploadUtils.uploadImage(
          { path: data.app_image_url },
          { maxSize: 1e6 },
        );
        data.app_image_url = res;
      }
      return CustomerRepo.create(data);
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

export const confirmCustomerMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return CustomerRepo.confirmInfo(id);
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

      Alert.alert({
        style: { width: 343 },
        title: 'Thông báo',
        message: `Xác thực thông tin khách hàng thành công!`,
      });

      queryClient.refetchQueries({
        queryKey: ['customer-detail'],
      });
      queryClient.refetchQueries({
        queryKey: ['infinite-customers-list'],
      });
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

export const unconfirmCustomerMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return CustomerRepo.unconfirmInfo(id);
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

      Alert.alert({
        style: { width: 343 },
        title: 'Thông báo',
        message: `Huỷ xác thực thông tin khách hàng thành công!`,
      });

      queryClient.refetchQueries({
        queryKey: ['customer-detail'],
      });
      queryClient.refetchQueries({
        queryKey: ['infinite-customers-list'],
      });
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
