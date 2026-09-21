export class ChangePasswordRequestCommand {
    constructor(
        public readonly token: string | undefined,
        public readonly password: string | undefined,
        public readonly confirmPassword: string | undefined
    ) {}
}
