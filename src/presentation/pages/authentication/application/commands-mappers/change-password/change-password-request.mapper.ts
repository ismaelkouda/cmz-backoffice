import { ChangePasswordRequestCommand } from '@presentation/pages/authentication/application/commands/change-password/change-password-request.command';
import { ChangePasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.contract';

export function changePasswordRequestCommandMapper(
    command: ChangePasswordRequestCommand
): ChangePasswordRequestContract {
    return {
        token: command.token,
        password: command.password,
        confirmPassword: command.confirmPassword,
    };
}
