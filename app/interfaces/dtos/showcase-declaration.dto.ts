export type ShowcaseImageDto = {
  group_exhibition_id: number;
  images_ids: string[];
};

export type CreateShowcaseDeclarationDto = {
  store_id: number;
  sla_showcase_id: number;
  salesperson_id: number;
  team_id?: number;
  router_id?: number;
  router_plan_id?: number;
  detail_router_plan_id?: number;
  create_uid: number;
  images_validation_ids: ShowcaseImageDto[];
};

export interface ConfirmShowcaseDeclarationDto {
  update_uid: number;
}