import { GroupExhibition } from '@app/interfaces/entities/group-exhibition.entity';
import ExhibitionRepo from '@app/repository/exhibition/ExhibitionRepo';
import { useQuery } from '@tanstack/react-query';

export const useExhibitionGroupsList = () => {
  return useQuery({
    queryKey: ['exhibition-groups-list'],
    queryFn: async ({ queryKey, signal }): Promise<GroupExhibition[]> => {
      const { response, error } = await ExhibitionRepo.getExhibitionGroups(
        signal,
      );

      if (error || !response?.group_exhibition) {
        throw error || new Error(`Cannot fetch exhibition groups list`);
      }
      return response.group_exhibition;
    },
    // retry: 0,
  });
};

export const useExhibitionGroup = (id: number | string) => {
  return useQuery({
    queryKey: ['exhibition-group-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<GroupExhibition> => {
      const { response, error } = await ExhibitionRepo.getOneExhibitionGroup(
        queryKey[1],
        signal,
      );

      if (error || !response?.group_exhibition?.[0]) {
        throw error || new Error(`Cannot fetch exhibition group detail`);
      }
      return response.group_exhibition[0];
    },
    // retry: 0,
  });
};
