export interface ResetPasswordRequestDto {
    readonly token: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
}
