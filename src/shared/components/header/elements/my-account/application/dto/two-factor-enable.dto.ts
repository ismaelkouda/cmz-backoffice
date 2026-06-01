export interface TwoFactorEnableDto {
    readonly userId: number;
    readonly email: string;
    readonly code: string;
}
