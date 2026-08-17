import { ResetPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/reset-password/reset-password-request.command';
import { ResetPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.contract';

export function resetPasswordRequestCommandMapper(
    command: ResetPasswordRequestCommand
): ResetPasswordRequestContract {
    return {
        token: command.token,
        email: command.email,
        password: command.password,
        confirmPassword: command.confirmPassword,
    };
}
