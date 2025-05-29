export interface TownsFilter {
  query?: string; // cho phép search theo tên/code
  district_id?: number; // search theo district_id (Id or name)
  state_id?: number; // theo state_id (ID or name)
  service_name?: string; // search theo service_name
  normalized_name?: string; // search theo normalized_name
}
