export class TwoFactorRequestCommand {
    constructor(
        public readonly userId: number,
        public readonly email: string
    ) {}
}
