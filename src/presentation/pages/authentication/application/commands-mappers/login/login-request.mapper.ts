import { LoginRequestCommand } from '@presentation/pages/authentication/application/commands/login/login-request.command';

export function loginRequestCommandMapper(command: LoginRequestCommand) {
    return {
        email: command.email,
        password: command.password,
    };
}
