import { TSummaryReport } from '@app/interfaces/entities/summary-report.type';
import HomeRepo from '@app/repository/HomeRepo';
import { useQuery } from '@tanstack/react-query';

export const useSummaryReport = (enabled = true) => {
  return useQuery({
    queryKey: ['fetch-summary-report'],
    queryFn: async ({ queryKey, signal }): Promise<TSummaryReport> => {
      const { response, error } = await HomeRepo.fetchSummaryReport(signal);

      if (error || !response?.summary_report) {
        throw error || new Error(`Cannot fetch summary report`);
      }
      return response.summary_report;
    },
    enabled,
  });
};
