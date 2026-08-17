export class PasswordChangeCommand {
    constructor(
        public readonly oldPassword: string,
        public readonly newPassword: string,
        public readonly newPasswordConfirmation: string
    ) {}
}
