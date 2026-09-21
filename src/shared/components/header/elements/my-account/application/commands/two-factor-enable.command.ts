export class TwoFactorEnableCommand {
    constructor(
        public readonly otp: string,
        public readonly channel: 'email' | 'sms'
    ) {}
}
