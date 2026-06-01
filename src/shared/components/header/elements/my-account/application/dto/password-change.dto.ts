export interface PasswordChangeDto {
    readonly oldPassword: string;
    readonly newPassword: string;
    readonly newPasswordConfirmation: string;
}
