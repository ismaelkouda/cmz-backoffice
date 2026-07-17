export class LoginRequestCommand {
    constructor(
        public readonly email: string | undefined,
        public readonly password: string | undefined
    ) {}
}
