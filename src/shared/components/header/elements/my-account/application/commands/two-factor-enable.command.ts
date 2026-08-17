export class TwoFactorEnableCommand {
    constructor(
        public readonly userId: number,
        public readonly email: string,
        public readonly code: string
    ) {}
}
