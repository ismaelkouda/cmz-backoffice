export interface TwoFactorVerifyDto {
    readonly userId: number;
    readonly email: string;
    readonly code: string;
}
