import { UsersEnableCommand } from '@pages/settings-security/application/commands/users/users-enable.command';

export function usersEnableCommandMapper(command: UsersEnableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
