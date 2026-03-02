export interface ResetPasswordRequestDto {
    password: string;
    confirm_password: string;
    token?: string;
    email?: string;
}
