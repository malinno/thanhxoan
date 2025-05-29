import { ErpSlaShowcase } from '@app/interfaces/entities/erp-sla-showcase.entity';
import { ErpSlaCheckin } from '@app/interfaces/entities/erp-sla-checkin.entity';
import RouterRepo from '@app/repository/route/RouteRepo';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { isNil } from 'lodash';
import SlaCheckInRepo from '@app/repository/check-in-out/SlaCheckInRepo';

export const useSlaCheckInList = () => {
  return useQuery({
    queryKey: ['sla-check-in-list'],
    queryFn: async ({ queryKey, signal }): Promise<ErpSlaCheckin[]> => {
      const { response, error } = await SlaCheckInRepo.fetchMany(signal);

      if (error || !response?.sla_showcase) {
        throw error || new Error(`Cannot fetch sla check in list`);
      }
      return response.sla_showcase;
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

export const useSlaCheckInDetail = (id?: number | string) => {
  return useQuery({
    queryKey: ['sla-check-in-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpSlaCheckin> => {
      if (!id) throw new Error(`sla check in id cannot be nil`);

      const { response, error } = await SlaCheckInRepo.fetchOne(id, signal);

      if (error || !response?.sla_checkin?.[0]) {
        throw error || new Error(`Cannot fetch sla check in detail`);
      }
      return response.sla_checkin[0];
    },
    enabled: !isNil(id),
  });
};
