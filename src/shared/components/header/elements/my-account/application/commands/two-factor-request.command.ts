export class TwoFactorRequestCommand {
    constructor(public readonly channel: 'email' | 'sms') {}
}
