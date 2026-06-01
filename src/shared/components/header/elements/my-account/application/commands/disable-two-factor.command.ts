export class DisableTwoFactorCommand {
    readonly type = 'disable-two-factor';

    constructor(
        public readonly userId: number,
        public readonly email: string
    ) {}
}
