export class TwoFactorDisableCommand {
    constructor(
        public readonly userId: number,
        public readonly email: string
    ) {}
}
