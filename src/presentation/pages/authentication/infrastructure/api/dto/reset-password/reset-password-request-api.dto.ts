export interface ResetPasswordRequestApiDto {
    token: string;
    password: string;
    password_confirmation: string;
}
