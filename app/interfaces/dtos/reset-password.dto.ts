export interface ResetPasswordDto {
    old_password: string
    password: string
    user_id: number
}