import ApiErp from '@app/api/ApiErp';
import {
  CreatePosOrderDto,
  UpdatePosOrderDto,
  UpdatePosOrderStateReasonDto,
} from '@app/interfaces/dtos/pos-order.dto';
import { SetOrderProductGiftDto } from '@app/interfaces/dtos/set-order-product-gift.dto';
import PosOrderRepo, {
  TPosOrderStateDto,
} from '@app/repository/order/PosOrderRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';
import { isEmpty } from 'lodash';

export type UpdatePosOrderStatePayload = {
  id: number | string;
  state: TPosOrderStateDto;
  data?: UpdatePosOrderStateReasonDto;
};

type EditPosOrderMutationData = {
  id: number | string;
  data: UpdatePosOrderDto;
};

type FetchPosOrderProductGiftMutationData = {
  id: number | string;
  promotionProgramId: number;
};

type SetPosOrderProductGiftMutationData = {
  id?: number | string;
  data: SetOrderProductGiftDto;
};

export const updatePosOrderStateMutation = () =>
  useMutation({
    mutationFn: async (payload: UpdatePosOrderStatePayload) => {
      const { id, state, data } = payload;
      return PosOrderRepo.updateState(id, state, data);
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

export const createPosOrderMutation = () =>
  useMutation({
    mutationFn: async (data: CreatePosOrderDto) => {
      return PosOrderRepo.create(data);
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

export const editPosOrderMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: EditPosOrderMutationData) => {
      if (!id) throw new Error(`order id cannot be nil`);

      return PosOrderRepo.update(id, data);
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

export const fetchPosOrderPromotionGiftMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      promotionProgramId,
    }: FetchPosOrderProductGiftMutationData) => {
      if (!id) throw new Error(`order id and promotion program cannot be nil`);

      return PosOrderRepo.fetchProductGifts(id, promotionProgramId);
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

export const setPosOrderPromotionGiftMutation = () =>
  useMutation({
    mutationFn: async ({ id, data }: SetPosOrderProductGiftMutationData) => {
      if (!id || isEmpty(data))
        throw new Error(`order id and data cannot be nil`);

      return PosOrderRepo.setProductGift(id, data);
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
