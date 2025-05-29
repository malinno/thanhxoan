import ApiErp from '@app/api/ApiErp';
import {
  CreateTimekeepingExplanationDto,
  TimekeepingExplanationStateDto,
  UpdateTimekeepingExplanationDto,
} from '@app/interfaces/dtos/timekeeping-explanation.dto';
import TimekeepingExplanationRepo from '@app/repository/check-in-out/TimekeepingExplanationRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';

type TimekeepingExplanationActionPayload = {
  id: number | string;
  state: TimekeepingExplanationStateDto;
  uid: number;
};

type EditTimekeepingExplanationMutationData = {
  id: number | string;
  data: UpdateTimekeepingExplanationDto;
};

export const updateTimekeepingExplanationMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      data,
    }: EditTimekeepingExplanationMutationData) => {
      return TimekeepingExplanationRepo.update(id, data);
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

export const createTimekeepingExplanationMutation = () =>
  useMutation({
    mutationFn: async (payload: CreateTimekeepingExplanationDto) => {
      return TimekeepingExplanationRepo.create(payload);
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

export const updateTimekeepingExplanationStateMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      state,
      uid,
    }: TimekeepingExplanationActionPayload) => {
      return TimekeepingExplanationRepo.updateState(id, state, uid);
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
