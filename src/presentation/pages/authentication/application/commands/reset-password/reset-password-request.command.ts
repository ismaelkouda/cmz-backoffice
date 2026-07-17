export class ResetPasswordRequestCommand {
    constructor(
        public readonly token: string | undefined,
        public readonly email: string | undefined,
        public readonly password: string | undefined,
        public readonly confirmPassword: string | undefined
    ) {}
}
