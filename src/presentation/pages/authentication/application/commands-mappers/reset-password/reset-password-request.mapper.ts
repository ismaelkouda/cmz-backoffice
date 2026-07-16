import { ResetPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/reset-password/reset-password-request.command';

export function resetPasswordRequestCommandMapper(
    command: ResetPasswordRequestCommand
) {
    return {
        password: command.password,
        confirmPassword: command.confirmPassword,
    };
}
