import ApiErp from "@app/api/ApiErp";
import { UpdateLeadDto } from "@app/interfaces/dtos/lead.dto";
import LeadRepo from "@app/repository/lead/LeadRepo";
import Alert from "@core/components/popup/Alert";
import { colors } from "@core/constants/colors.constant";
import images from "@images";
import { useMutation } from "@tanstack/react-query";

type UpdateLeadMutationData = {
    id?: number | string;
    data: UpdateLeadDto;
  };

export const updateLeadMutation = () => useMutation({
    mutationFn: async ({ id, data }: UpdateLeadMutationData) => {
      if (!id) throw new Error(`lead id cannot be nil`);
      return LeadRepo.update(id, data);
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