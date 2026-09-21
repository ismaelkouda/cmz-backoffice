export interface PasswordChangeApiDto {
    readonly last_password: string;
    readonly new_password: string;
    readonly new_password_confirmation: string;
}
