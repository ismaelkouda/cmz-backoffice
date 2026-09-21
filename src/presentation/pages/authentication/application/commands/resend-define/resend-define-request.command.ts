export class ResendDefineRequestCommand {
    constructor(
        public readonly token: string | undefined,
        public readonly email: string | undefined
    ) {}
}
