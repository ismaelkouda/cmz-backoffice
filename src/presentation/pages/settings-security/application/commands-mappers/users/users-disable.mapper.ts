import { UsersDisableCommand } from '@pages/settings-security/application/commands/users/users-disable.command';

export function usersDisableCommandMapper(command: UsersDisableCommand) {
    return {
        uniqId: command.uniqId,
    };
}
