import { UsersCreateCommand } from '@pages/settings-security/application/commands/users/users-create.command';

export function usersCreateCommandMapper(command: UsersCreateCommand) {
    return {
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        phone: command.phone,
        profile: command.profile,
        // role: command.role,
    };
}
