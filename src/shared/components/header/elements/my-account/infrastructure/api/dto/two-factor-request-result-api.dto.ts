export interface TwoFactorRequestResultApiDto {
    readonly channel: 'email' | 'sms';
    readonly expired_at: string;
    readonly timeout: number;
}
