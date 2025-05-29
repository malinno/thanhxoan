import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { PromotionProgramsFilter } from '@app/interfaces/query-params/promotion-programs.filter';
import PromotionRepo from '@app/repository/promotion/PromotionRepo';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';

export const usePromotionPrograms = (filter?: PromotionProgramsFilter) => {
  return useQuery({
    queryKey: ['promotion-programs-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<PromotionProgram[]> => {
      const { response, error } = await PromotionRepo.fetchMany(
        {
          is_dms: true,
          active: true,
          ...filter,
        },
        signal,
      );

      if (error || !response?.promotion_program) {
        throw error || new Error(`Cannot fetch promotion_program`);
      }
      return response.promotion_program;
    },
    // retry: 0,
  });
};

export const usePromotionProgramDetail = (
  id?: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['promotion-program-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<PromotionProgram> => {
      if (!queryKey[1]) throw new Error(`program id cannot be nil`);

      const { response, error } = await PromotionRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.promotion_program?.[0])
        throw error || new Error(`Cannot fetch program id ${queryKey[1]}`);

      return response?.promotion_program?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};
