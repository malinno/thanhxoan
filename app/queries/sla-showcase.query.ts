import { ErpSlaShowcase } from '@app/interfaces/entities/erp-sla-showcase.entity';
import ExhibitionRepo from '@app/repository/exhibition/ExhibitionRepo';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export const useSlaShowcasesList = () => {
  return useQuery({
    queryKey: ['sla-showcases-list'],
    queryFn: async ({ queryKey, signal }): Promise<ErpSlaShowcase[]> => {
      const { response, error } = await ExhibitionRepo.getSlaShowcases(signal);

      if (error || !response?.sla_showcase) {
        throw error || new Error(`Cannot fetch sla_showcase list`);
      }
      return response.sla_showcase
      // .filter((s: ErpSlaShowcase) => {
      //   const now = dayjs().toDate();
      //   const beginAt = dayjs(s.start_date, 'YYYY-MM-DD').toDate();
      //   const endAt = dayjs(s.end_date, 'YYYY-MM-DD').toDate();
      //   console.log(`now`, now)
      //   console.log(`beginAt`, beginAt)
      //   console.log(`endAt`, endAt)
      //   return beginAt <= now && now < endAt;
      // });
    },
    // retry: 0,
  });
};

export const useSlaShowcaseDetail = (id: number | string) => {
  return useQuery({
    queryKey: ['sla-showcase-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpSlaShowcase> => {
      const { response, error } = await ExhibitionRepo.getSlaShowcaseDetail(
        queryKey[1],
        signal,
      );

      if (error || !response?.sla_showcase?.[0]) {
        throw error || new Error(`Cannot fetch sla showcase detail`);
      }
      return response.sla_showcase[0];
    },
    // retry: 0,
  });
};
