export interface TwoFactorEnableProps {
    otp: string;
    channel: 'email' | 'sms';
}
