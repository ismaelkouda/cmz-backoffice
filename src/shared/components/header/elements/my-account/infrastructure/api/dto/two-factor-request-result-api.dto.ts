export interface TwoFactorRequestResultApiDto {
    readonly message: string;
    readonly masked_recipient: string;
    readonly expires_in_seconds: number;
    readonly issued_at: string;
}
