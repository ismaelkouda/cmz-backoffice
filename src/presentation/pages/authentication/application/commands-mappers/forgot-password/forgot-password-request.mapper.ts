import { ForgotPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/forgot-password/forgot-password-request.command';

export function forgotPasswordRequestCommandMapper(
    command: ForgotPasswordRequestCommand
) {
    return {
        email: command.email,
    };
}
