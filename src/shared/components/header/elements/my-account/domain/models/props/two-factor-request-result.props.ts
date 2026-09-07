export interface TwoFactorRequestResultPops {
    readonly channel: 'email' | 'sms';
    readonly expiredAt: string;
    readonly timeout: number;
}
