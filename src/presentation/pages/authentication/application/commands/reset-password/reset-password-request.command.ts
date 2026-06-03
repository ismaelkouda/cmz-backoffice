export class ResetPasswordRequestCommand {
    constructor(
        public readonly password: string,
        public readonly confirmPassword: string
    ) {}
}
