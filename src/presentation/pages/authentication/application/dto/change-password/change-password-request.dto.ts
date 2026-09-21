export interface ChangePasswordRequestDto {
    readonly token: string;
    readonly password: string;
    readonly confirmPassword: string;
}
