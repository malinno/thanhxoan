export type CustomerContactDto = {
  name: string;
  type?: string;
  phone: string;
  email?: string;
  description?: string;
  street2?: string;
  address_state_id?: number;
  address_district_id?: number;
  address_town_id?: number;
  function?: string;
  comment?: string;
};
