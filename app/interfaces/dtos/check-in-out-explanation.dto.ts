export interface CheckInOutExplanationDto {
    reason_cico_id: number;
    reason_explanation?: string
}

export type CheckInOutExplanationStatusDto = 'confirm' | 'approve' | 'reject' | 'cancel';