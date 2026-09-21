export interface ChangePasswordRequestApiDto {
    token: string;
    password: string;
    password_confirmation: string;
}
