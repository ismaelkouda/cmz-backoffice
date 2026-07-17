import { UsersQuery } from '@pages/settings-security/application/queries/users/users.query';

export function usersQueryMapper(command: UsersQuery) {
    return {
        search: command.search,
        profile: command.profile,
        role: command.role,
        isActive: command.isActive,
    };
}
