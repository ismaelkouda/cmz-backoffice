import { ProfilesPermissionsUsersRemoveCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-remove.command';

export function profilesPermissionsUsersRemoveCommandMapper(
    command: ProfilesPermissionsUsersRemoveCommand
) {
    return {
        uniqId: command.uniqId,
        users: command.users,
    };
}
