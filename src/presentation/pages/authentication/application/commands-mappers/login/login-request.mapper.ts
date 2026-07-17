import { LoginRequestCommand } from '@presentation/pages/authentication/application/commands/login/login-request.command';
import { LoginRequestContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.contract';

export function loginRequestCommandMapper(
    command: LoginRequestCommand
): LoginRequestContract {
    return {
        email: command.email,
        password: command.password,
    };
}
