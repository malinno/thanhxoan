import ApiErp from '@app/api/ApiErp';
import { CheckIOExplanationStatus } from '@app/enums/check-io-explanation-status.enum';
import {
  CheckInOutExplanationDto,
  CheckInOutExplanationStatusDto,
} from '@app/interfaces/dtos/check-in-out-explanation.dto';
import CheckInOutExplanationRepo from '@app/repository/check-in-out/CheckInOutExplanationRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useMutation } from '@tanstack/react-query';

type CheckInOutExplanationMutationPayload = {
  id: string | number;
  data: CheckInOutExplanationDto;
};

type CheckIOExplanationActionPayload = {
  id: number | string;
  status: CheckInOutExplanationStatusDto;
  uid: number;
};

export const createCheckInOutExplanationMutation = () =>
  useMutation({
    mutationFn: async (payload: CheckInOutExplanationMutationPayload) => {
      return CheckInOutExplanationRepo.create(payload.id, payload.data);
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

export const updateExplanationStatusMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      status,
      uid,
    }: CheckIOExplanationActionPayload) => {
      return CheckInOutExplanationRepo.updateStatus(id, status, uid);
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
