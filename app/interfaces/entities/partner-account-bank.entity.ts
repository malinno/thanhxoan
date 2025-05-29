import { DmsBank } from './bank.entity';

export type PartnerAccountBank = {
  id: number;
  bank_id: DmsBank;
  bank_branch: string;
  account_owner: string;
  account_number: string;
};
