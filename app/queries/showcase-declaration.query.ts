import { ErpShowcaseDeclaration } from '@app/interfaces/entities/showcase-declaration.entity';
import { ShowcaseDeclarationsFilter } from '@app/interfaces/query-params/showcase-declarations.filter';
import ExhibitionRepo from '@app/repository/exhibition/ExhibitionRepo';
import { useMutation, useQuery } from '@tanstack/react-query';

export type ShowcaseImageValidation = {
  group_exhibition_id: number;
  images_ids: string[];
};

export type CreateShowcaseDeclaration = {
  store_id: number;
  salesperson_id: number;
  create_uid: number;
  images_validation_ids: ShowcaseImageValidation[];
};

export const useShowcaseDeclarationsList = (
  filter?: ShowcaseDeclarationsFilter,
) => {
  return useQuery({
    queryKey: ['showcase-declarations-list', filter],
    queryFn: async ({
      queryKey,
      signal,
    }): Promise<ErpShowcaseDeclaration[]> => {
      const { response, error } = await ExhibitionRepo.getShowcaseDeclarations(
        queryKey[1] as ShowcaseDeclarationsFilter,
        signal,
      );

      if (error || !response?.showcase_declaration) {
        throw error || new Error(`Cannot fetch showcase declarations list`);
      }
      return response.showcase_declaration;
    },
    // retry: 0,
  });
};

export const useShowcaseDeclarationDetail = (id: number | string) => {
  return useQuery({
    queryKey: ['showcase-declaration-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpShowcaseDeclaration> => {
      const { response, error } =
        await ExhibitionRepo.getOneShowcaseDeclaration(queryKey[1], signal);

      if (error || !response?.showcase_declaration?.[0]) {
        throw error || new Error(`Cannot fetch showcase declaration detail`);
      }
      return response.showcase_declaration[0];
    },
    // retry: 0,
  });
};