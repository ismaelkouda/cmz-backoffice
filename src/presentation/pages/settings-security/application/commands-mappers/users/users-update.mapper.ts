import { UsersUpdateCommand } from '@pages/settings-security/application/commands/users/users-update.command';

export function usersUpdateCommandMapper(command: UsersUpdateCommand) {
    return {
        uniqId: command.uniqId,
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        phone: command.phone,
        profile: command.profile,
        // role: command.role,
    };
}
