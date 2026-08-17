import { ProfilesPermissionsDeleteCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-delete.command';

export function profilesPermissionsDeleteCommandMapper(
    command: ProfilesPermissionsDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
