export class LoginRequestCommand {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
}
