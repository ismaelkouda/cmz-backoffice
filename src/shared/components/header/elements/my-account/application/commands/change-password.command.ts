export class ChangePasswordCommand {
    readonly type = 'change-password';

    constructor(
        public readonly oldPassword: string,
        public readonly newPassword: string,
        public readonly newPasswordConfirmation: string
    ) {}
}
