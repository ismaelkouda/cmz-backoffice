export interface TwoFactorEnableApiDto {
    readonly otp: string;
    readonly channel: 'email' | 'sms';
}
