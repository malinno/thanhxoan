export interface DetailRoutePlanDto {
  router_id: number;
  from_date: string;
  to_date: string;
  description?: string;
  store_id: number;
  router_plan_id: number
  user_id?: number
  team_id?: number
  crm_group_id?: number
}

export interface CreateDetailRoutePlanDto extends DetailRoutePlanDto {
  create_uid: number;
}

export interface UpdateDetailRoutePlanDto extends Partial<DetailRoutePlanDto> {
  update_uid: number;
}
