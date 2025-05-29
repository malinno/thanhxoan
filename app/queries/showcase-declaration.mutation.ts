import ApiErp from '@app/api/ApiErp';
import {
  ConfirmShowcaseDeclarationDto,
  CreateShowcaseDeclarationDto,
} from '@app/interfaces/dtos/showcase-declaration.dto';
import ExhibitionRepo from '@app/repository/exhibition/ExhibitionRepo';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import UploadUtils from '@core/utils/UploadUtils';
import images from '@images';
import { useMutation } from '@tanstack/react-query';

type ConfirmShowcaseDeclarationMutationData = {
  id: number | string;
  data: ConfirmShowcaseDeclarationDto;
};

export const createShowcaseMutation = () =>
  useMutation({
    mutationFn: async (data: CreateShowcaseDeclarationDto) => {
      data.images_validation_ids = await Promise.all(
        data.images_validation_ids.map(async it => {
          it.images_ids = await Promise.all(
            it.images_ids.map(async path => {
              if (path.startsWith('http')) return path;

              const res = await UploadUtils.uploadImage(
                { path },
                { maxSize: 1e6 },
              );
              return res;
            }),
          );
          return it;
        }),
      );

      return ExhibitionRepo.createShowcaseDeclaration(data);
    },
    onSuccess: ({ response, error }) => {
      if (error || !response?.result || response.result.message)
        throw error || response?.result;

      //   onCreated?.(response.result);
      //   navigation.goBack();
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

export const confirmShowcaseMutation = () =>
  useMutation({
    mutationFn: async (payload: ConfirmShowcaseDeclarationMutationData) => {
      return ExhibitionRepo.confirmShowcaseDeclaration(
        payload.id,
        payload.data,
      );
    },
    onSuccess: ({ response, error }) => {
      if (error || !response?.result || response.result.message)
        throw error || response?.result;
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
