import { ProfilesPermissionsUpdateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-update.command';

export function profilesPermissionsUpdateCommandMapper(
    command: ProfilesPermissionsUpdateCommand
) {
    return {
        uniqId: command.uniqId,
        name: command.name,
        description: command.description,
        permissions: command.permissions,
    };
}
