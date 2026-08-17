export interface TwoFactorEnableApiDto {
    readonly user_id: number;
    readonly email: string;
    readonly code: string;
}
