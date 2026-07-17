import { ProfilesPermissionsUsersAssignCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-users-assign.command';

export function profilesPermissionsUsersAssignCommandMapper(
    command: ProfilesPermissionsUsersAssignCommand
) {
    return {
        uniqId: command.uniqId,
        users: command.users,
    };
}
