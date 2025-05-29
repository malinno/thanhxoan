import ApiErp from '@app/api/ApiErp';
import {
  CreateSaleOrderDto,
  UpdateSaleOrderDto,
} from '@app/interfaces/dtos/sale-order.dto';
import { SetOrderProductGiftDto } from '@app/interfaces/dtos/set-order-product-gift.dto';
import SaleOrderRepo, {
  TSaleOrderStateDto,
} from '@app/repository/order/SaleOrderRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';
import { isEmpty } from 'lodash';

type UpdateSaleOrderStatePayload = {
  id: number | string;
  state: TSaleOrderStateDto;
};

type EditSaleOrderMutationData = {
  id?: number | string;
  data: UpdateSaleOrderDto;
};

type FetchSaleOrderProductGiftMutationData = {
  id: number | string;
  promotionProgramId: number;
};

type SetSaleOrderProductGiftMutationData = {
  id?: number | string;
  data: SetOrderProductGiftDto;
};

export const updateSaleOrderStateMutation = () =>
  useMutation({
    mutationFn: async ({ id, state }: UpdateSaleOrderStatePayload) => {
      return SaleOrderRepo.updateState(id, state);
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

export const createSaleOrderMutation = () =>
  useMutation({
    mutationFn: async (data: CreateSaleOrderDto) => {
      return SaleOrderRepo.create(data);
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

export const editSaleOrderMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: EditSaleOrderMutationData) => {
      if (!id) throw new Error(`order id cannot be nil`);

      return SaleOrderRepo.update(id, data);
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

export const fetchSaleOrderPromotionGiftMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      promotionProgramId,
    }: FetchSaleOrderProductGiftMutationData) => {
      if (!id) throw new Error(`order id and promotion program cannot be nil`);

      return SaleOrderRepo.fetchProductGifts(id, promotionProgramId);
    },
    onSuccess: ({ response, error }) => {
      if (error || response?.error || !response?.product_gift) {
        throw error || response?.error;
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

export const setSaleOrderPromotionGiftMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: SetSaleOrderProductGiftMutationData) => {
      if (!id || isEmpty(data))
        throw new Error(`order id and data cannot be nil`);

      return SaleOrderRepo.setProductGift(id, data);
    },
    onSuccess: ({ response, error }) => {},
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
