export class RequestTwoFactorCommand {
    readonly type = 'request-two-factor';

    constructor(
        public readonly userId: number,
        public readonly email: string
    ) {}
}
