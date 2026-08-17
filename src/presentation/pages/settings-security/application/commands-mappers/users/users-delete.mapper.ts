import { UsersDeleteCommand } from '@pages/settings-security/application/commands/users/users-delete.command';

export function usersDeleteCommandMapper(command: UsersDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
