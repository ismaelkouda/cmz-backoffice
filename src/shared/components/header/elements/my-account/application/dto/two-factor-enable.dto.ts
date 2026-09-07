export interface TwoFactorEnableDto {
    readonly otp: string;
    readonly channel: 'email' | 'sms';
}
