import { ProfilesPermissionsUsersReassignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-reassign.command';

export function profilesPermissionsUsersReassignCommandMapper(
    command: ProfilesPermissionsUsersReassignCommand
) {
    return {
        uniqId: command.uniqId,
        users: command.users,
    };
}
