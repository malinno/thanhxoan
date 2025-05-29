import ApiErp from '@app/api/ApiErp';
import {
  CreateStockInventoryLineDto,
  UpdateStockInventoryLineDto,
} from '@app/interfaces/dtos/stock-inventory-line.dto';
import {
  ConfirmStockInventoryDto,
  CreateStockInventoryDto,
  UpdateStockInventoryDto,
} from '@app/interfaces/dtos/stock-inventory.dto';
import StockInventoryRepo from '@app/repository/inventory/StockInventoryRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';

type UpdateStockInventoryMutationData = {
  id: number | string;
  data: UpdateStockInventoryDto;
};

type ConfirmStockInventoryMutationData = {
  id: number | string;
  data: ConfirmStockInventoryDto;
};

type UpdateStockInventoryLineMutationData = {
  id: number | string;
  data: UpdateStockInventoryLineDto;
};

export const createStockInventoryMutation = () =>
  useMutation({
    mutationFn: async (data: CreateStockInventoryDto) => {
      return StockInventoryRepo.create(data);
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

export const editStockInventoryMutation = () =>
  useMutation({
    mutationFn: async (payload: UpdateStockInventoryMutationData) => {
      return StockInventoryRepo.update(payload.id, payload.data);
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

export const confirmStockInventoryMutation = () =>
  useMutation({
    mutationFn: async (payload: ConfirmStockInventoryMutationData) => {
      return StockInventoryRepo.confirm(payload.id, payload.data);
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

export const createStockInventoryLineMutation = () =>
  useMutation({
    mutationFn: async (data: CreateStockInventoryLineDto) => {
      return StockInventoryRepo.createLine(data);
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

export const editStockInventoryLineMutation = () =>
  useMutation({
    mutationFn: async (payload: UpdateStockInventoryLineMutationData) => {
      return StockInventoryRepo.updateLine(payload.id, payload.data);
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

  export const deleteStockInventoryLineMutation = () =>
    useMutation({
      mutationFn: async (id: number | string) => {
        return StockInventoryRepo.deleteLine(id);
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