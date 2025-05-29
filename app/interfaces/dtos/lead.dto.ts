type LeadNoteAction = 'create' | 'add' | 'remove';

type LeadNoteLine = {
  [key in LeadNoteAction]?: { name: string }[];
};

type LeadTagLine = {
  [key in LeadNoteAction]?: number[]
}

export interface LeadDto {
  name?: string;
  hen_goi_lai?: string;
  note2_ids?: LeadNoteLine;
  tag_ids?: LeadTagLine,
  stage_id?: number
}

export interface CreateLeadDto extends LeadDto {
  create_uid: number;
}

export interface UpdateLeadDto extends LeadDto {
  update_uid: number;
}
