import { ForgotPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/forgot-password/forgot-password-request.command';
import { ForgotPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.contract';

export function forgotPasswordRequestCommandMapper(
    command: ForgotPasswordRequestCommand
): ForgotPasswordRequestContract {
    return {
        email: command.email,
    };
}
