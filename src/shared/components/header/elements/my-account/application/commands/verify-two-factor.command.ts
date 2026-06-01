export class VerifyTwoFactorCommand {
    readonly type = 'verify-two-factor';

    constructor(
        public readonly userId: number,
        public readonly email: string,
        public readonly code: string
    ) {}
}
