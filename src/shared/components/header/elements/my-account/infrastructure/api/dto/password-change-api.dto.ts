export interface PasswordChangeApiDto {
    readonly old_password: string;
    readonly new_password: string;
    readonly new_password_confirmation: string;
}
